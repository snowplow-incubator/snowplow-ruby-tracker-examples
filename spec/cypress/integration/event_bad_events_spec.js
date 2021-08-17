describe("Bad events", () => {
  it("do not occur", () => {
    cy.resetMicro();

    cy.visit("/");

    //  fill this in later

    cy.badEvents().count(0);
  });
});
