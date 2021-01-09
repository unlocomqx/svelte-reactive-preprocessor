/// <reference types="Cypress" />

describe("App test", () => {

  it("does not break app", () => {
    cy
    .visit("/")
    .get("#app")
    .contains("Hello world!");
  });

});
