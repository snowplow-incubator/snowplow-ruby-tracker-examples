describe("Self-describing events", () => {
  it("are correctly emitted for basket add activity", () => {
    cy.resetMicro();

    cy.visit("shop/brown_skis");
    cy.get("#basket-add-form").click();

    cy.wait(1500);

    cy.goodEvents().hasEventType();
  });
});
