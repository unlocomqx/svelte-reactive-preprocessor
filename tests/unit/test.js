const fs = require("fs");
const path = require("path");
let {rxdPreprocess} = require("../../index");
const assert = require("assert");

function transfrorm(content) {
    let transformer = rxdPreprocess();
    let {code} = transformer.script.call(null, {content, id: 'ABCD', filename: '', line: 0});
    return code;
}

describe("Reactive statements transformer", function () {

  it("transform reactive statement", function () {
      assert.strictEqual(transfrorm("$: double = count * 2;"), fs.readFileSync(path.join(__dirname, 'output/reactive.txt')).toString().trim());
  });

});
