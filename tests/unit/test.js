const fs = require("fs");
const path = require("path");
let {rxdPreprocess} = require("../../index");
const assert = require("assert");

function transfrorm(content) {
    let transformer = rxdPreprocess();
    let {code} = transformer.script.call(null, {content, id: 'ABCD', filename: '', line: 0});
    return code;
}

function read(file) {
  return fs.readFileSync(path.join(__dirname, file)).toString();
}

describe("Reactive statements transformer", function () {

  it("transform reactive statement and add explicit let", function () {
      assert.strictEqual(transfrorm("$: double = count * 2;"), read('output/reactive.txt').trim());
  });

  it("transform reactive statement and does not add explicit let for declared variable", function () {
      assert.strictEqual(transfrorm(read('input/declared.js')), read('output/declared.txt').trim());
  });

});
