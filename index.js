const acorn = require("acorn");
const {extract_names, analyze} = require("periscopic");
const linenumber = require("linenumber");
const escapeStringRegexp = require("escape-string-regexp");
const stringify = require("./stringify");
const fs = require("fs");

function inNodeModules(path) {
  return /\/node_modules\//.test(path);
}

function doPreprocess(options) {
  if (inNodeModules(options.filename)) {
    return;
  }
  let code = options.content;
  const file_contents = fs.existsSync(options.filename) ? fs.readFileSync(options.filename).toString() : null;

  const replacements = [];
  const inject_vars = new Set();

  let parsed;
  try {
    parsed = acorn.parse(code, {ecmaVersion: "latest", sourceType: "module"});
  } catch (e) {
    e.message = "An error occurred in the svelte-reactive-preprocessor, make sure it's placed after the typescript preprocessor: " + e.message;
    throw e;
  }

  function getLineNumber(labeled_statement) {
    if (!file_contents) {
      return 0;
    }
    let result = linenumber(file_contents, escapeStringRegexp(labeled_statement));
    if (!result) {
      return 0;
    }
    return result[0].line;
  }

  function wrapStatement(statement, filename, line_number) {
    // options.id comes from unit tests only
    const id = options.id || uniqId(4);
    let details = `{statement: ${stringify(statement)}, filename: ${stringify(filename)}, line: ${line_number}, id: "${id}"}`;
    let start_ev = `{ let svrp_start = Date.now(); let svrp_exec = Math.random(); let start_state = eval("$$$self.$capture_state()"); rpDsp('SvelteReactiveStart', ${details}, svrp_start, svrp_exec, start_state);`;
    // eval is used to avoid the svelte compiler.
    // $$$ is used because something is replacing $$ with one $
    let end_ev = `rpDsp('SvelteReactiveEnd', ${details}, svrp_start, svrp_exec, start_state, eval("$$$self.$capture_state()")); }`;
    return `${start_ev} ${statement} ${end_ev}`;
  }

  function replaceRange(str, start, end, substitute) {
    return str.substring(0, start) + substitute + str.substring(end);
  }

  function uniqId(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function addReactiveStatement(node) {
    const body = node.body;

    if (body.type === "ExpressionStatement") {
      const {expression} = node.body;
      if (expression.type === "AssignmentExpression") {
        if (expression.left.type !== "MemberExpression") {
          extract_names(expression.left).forEach(name => {
            if (name[0] !== "$") {
              inject_vars.add(name);
            }
          });
        }
      }
    }

    const labeled_statement = code.substring(node.start, node.end);
    const statement = code.substring(body.start, body.end);
    const wrapped = wrapStatement(statement, options.filename, getLineNumber(labeled_statement));
    const uniqid = uniqId(statement.length);
    code = replaceRange(code, body.start, body.end, uniqid);
    replacements.push({
      uniqid,
      statement: wrapped,
    });
  }

  function replaceReactiveStatements() {
    replacements.forEach(repl => {
      code = code.replace(repl.uniqid, repl.statement);
    });
  }

  function injectVariables(declarations) {
    inject_vars.forEach(variable => {
      if (!declarations.has(variable)) {
        code = `let ${variable};\n` + code;
      }
    });
  }

  if (parsed && parsed.body) {
    const {scope} = analyze(parsed);

    parsed.body.forEach(node => {
      if (node.type === "LabeledStatement" && node.label.name === "$") {
        addReactiveStatement(node);
      }
    });

    if (replacements.length) {
      replaceReactiveStatements();
    }

    injectVariables(scope.declarations);
  }

  code += `\n window.rpDsp = window.rpDsp || function() {}; \n`;

  const version = require("./package.json").version;
  code += `\nrpDsp('SvelteReactiveEnable', {version: "${version}"});`;

  return {code};
}

function reactivePreprocess(userOptions) {
  const options = {
    enabled: true,

    ...userOptions
  };

  if (!options.enabled) {
    return {};
  }

  return {
    script: doPreprocess
  };
}

module.exports = {reactivePreprocess};
