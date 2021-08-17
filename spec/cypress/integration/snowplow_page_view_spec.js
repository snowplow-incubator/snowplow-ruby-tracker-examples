// sending page view events with Ruby and JS

describe("Page view events", () => {
  it("Micro receives a JS event", () => {
    cy.visit("/");

    cy.badEvents().should("not.exist");
  });
});
