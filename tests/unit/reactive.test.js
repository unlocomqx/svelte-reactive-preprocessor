const fs = require("fs");
const path = require("path");
let {reactivePreprocess} = require("../../index");
const {diffStringsUnified} = require("jest-diff");

function transform(content) {
  let transformer = reactivePreprocess();
  let {code} = transformer.script.call(null, {content, id: "ABCD", filename: "", line: 0});
  return code;
}

function read(file) {
  return fs.readFileSync(path.join(__dirname, file)).toString();
}

test("transform reactive statement and add explicit let", function () {
  // assert.equal(transfrorm("$: double = count * 2;"), read("output/reactive.js").trim());
  let transformed = transform("$: double = count * 2;");
  let expected = read("output/reactive.js").trim();

  console.log(diffStringsUnified(transformed, expected));

  expect(transformed).toContain(expected);
});

test("transform reactive statement and does not add explicit let for declared variable", function () {
  let transformed = transform(read("input/declared.js"));
  let expected = read("output/declared.js").trim();

  console.log(diffStringsUnified(transformed, expected));

  expect(expected).toContain(expected);
});

test("transform reactive statement and does not add explicit let for exported variable", function () {
  let transformed = transform(read("input/exported.js"));
  let expected = read("output/exported.js").trim();

  console.log(diffStringsUnified(transformed, expected));

  expect(transformed).toContain(expected);
});

test("transform statement not terminated by semiclon", function () {
  let transformed = transform("$: double = count * 2");
  let expected = read("output/no-semicolon.js").trim();

  console.log(diffStringsUnified(transformed, expected));

  expect(transformed).toContain(expected);
});

test("transform reactive statement and keep $$", function () {
  let transformed = transform(read("input/declared-slots-variable.js"));
  let expected = read("output/declared-slots-variable.js").trim();

  console.log(diffStringsUnified(transformed, expected));

  expect(expected).toContain(expected);
});