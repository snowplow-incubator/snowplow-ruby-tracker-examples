// sending page view events with Ruby and JS

describe("Page view events", () => {
  it("Micro didn't receive any bad events", () => {
    cy.visit("/");

    cy.badEvents().should("not.exist");
  });
});
