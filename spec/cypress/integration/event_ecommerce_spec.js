describe("eCommerce events", () => {
  it("have correct events and details", () => {
    cy.resetMicro();

    cy.visit("shop/blue_skis");
    cy.get("#basket-add-form").click();
    cy.get("#basket-add-form").click();

    cy.wait(500);

    cy.get("#purchase-submit").click();

    cy.wait(2000);

    cy.goodEvents()
      .hasEventType("transaction", "rb")
      .eventDetails({ tr_orderid: "ABC-123", tr_total: 600 });

    cy.goodEvents().hasEventType("transaction_item", "rb").eventDetails({
      ti_orderid: "ABC-123",
      ti_sku: "SKI-BL123-M",
      ti_name: "Blue skis (size M)",
      ti_price: 300,
      ti_quantity: 2,
    });
  });
});
