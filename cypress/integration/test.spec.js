/// <reference types="Cypress" />

describe("App test", () => {

  it("does not break app", () => {
    cy
    .visit("/")
    .get("#app")
    .contains("Hello world!")
    .get("#add")
    .click()
    .get("#result")
    .should("contain", "Count: 2")
    .and("contain", "Double: 4")
    .and("contain", "Triple: 6")
    .and("contain", "Half: 1")
    .and("contain", "Quarter: 0.5");
  });

});
