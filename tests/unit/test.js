const fs = require("fs");
const path = require("path");
let {reactivePreprocess} = require("../../index");
var expect = require('chai').expect;


function transfrorm(content) {
    let transformer = reactivePreprocess();
    let {code} = transformer.script.call(null, {content, id: 'ABCD', filename: '', line: 0});
    return code;
}

function read(file) {
  return fs.readFileSync(path.join(__dirname, file)).toString();
}

describe("Reactive statements transformer", function () {

  it("transform reactive statement and add explicit let", function () {
      expect(transfrorm("$: double = count * 2;")).to.contain(read('output/reactive.js').trim());
  });

  it("transform reactive statement and does not add explicit let for declared variable", function () {
      expect(transfrorm(read('input/declared.js'))).to.contain(read('output/declared.js').trim());
  });

  it("transform reactive statement and does not add explicit let for exported variable", function () {
      expect(transfrorm(read('input/exported.js'))).to.contain(read('output/exported.js').trim());
  });

});
