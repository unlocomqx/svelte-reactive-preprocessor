const acorn = require("acorn");
const {extract_names} = require("periscopic");
const linenumber = require('linenumber');
const escapeStringRegexp = require('escape-string-regexp');
const fs = require("fs");

function rxdDoPreprocess(options) {
  let code = options.content;
  const file_contents = fs.readFileSync(options.filename).toString();

  const replacements = [];
  const declared_vars = new Set();
  const inject_vars = new Set();

  let parsed;
  try {
    parsed = acorn.parse(options.content, {ecmaVersion: "2019", sourceType: "module"});
  } catch (e) {
    e.message = "An error occurred in the svelte_rxd_preprocessor, make sure it's placed after the typescript preprocessor: " + e.message;
    throw e;
  }

  function getLineNumber(labeled_statement) {
    let result = linenumber(file_contents, escapeStringRegexp(labeled_statement));
    if (!result) {
      return 0;
    }
    return result[0].line;
  }

  function wrapStatement(statement, filename, line_number) {
    const id = makeid(4);
    let details = `{statement: ${JSON.stringify(statement)}, filename: ${JSON.stringify(filename)}, line: ${line_number}, id: "${id}"}`;
    let start_ev = `{ let svrxd_start = Date.now(); dsp('SvelteReactiveStart', ${details}, svrxd_start);`;
    let end_ev = `dsp('SvelteReactiveEnd', ${details}, svrxd_start, eval("$$$self.$capture_state()")); }`;
    return `${start_ev} ${statement} ${end_ev}`;
  }

  function replaceRange(str, start, end, substitute) {
    return str.substring(0, start) + substitute + str.substring(end);
  }

  function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function addDeclaration(node) {
    node.declarations.forEach(declarator => {
      extract_names(declarator.id).forEach(name => {
        declared_vars.add(name);
      });
    });
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
    const uniqid = makeid(statement.length);
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

  function injectVariables() {
    inject_vars.forEach(variable => {
      if (!declared_vars.has(variable)) {
        code = `let ${variable};` + code;
      }
    });
  }

  if (parsed && parsed.body) {
    parsed.body.forEach(node => {
      if (node.type === "VariableDeclaration") {
        addDeclaration(node);
      }
    });

    parsed.body.forEach(node => {
      if (node.type === "LabeledStatement" && node.label.name === "$") {
        addReactiveStatement(node);
      }
    });

    if (replacements.length) {
      replaceReactiveStatements();
    }
    injectVariables();
  }

  function dsp(type, detail, start_time, state) {
    console.log(state);
    const ev = document.createEvent("CustomEvent");
    detail = detail || {};
    detail.start_time = start_time;
    detail.state = state;
    ev.initCustomEvent(type, false, false, detail);
    document.dispatchEvent(ev);
  }

  code += "\n" + dsp.toString() + ";";
  code += `\ndsp('SvelteReactiveEnable')`;

  return {code};
}

function rxdPreprocess(userOptions) {
  const options = {
    enabled: true,

    ...userOptions
  };

  if (!options.enabled) {
    return {};
  }

  return {
    script: rxdDoPreprocess
  };
}

module.exports = {rxdPreprocess};
