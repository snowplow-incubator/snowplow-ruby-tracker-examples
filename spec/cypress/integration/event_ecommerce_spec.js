describe("eCommerce events", () => {
  it("have correct events and details", () => {
    cy.resetMicro();

    cy.visit("shop/blue_skis");
    cy.get("#basket-add-form").click();
    cy.get("#basket-add-form").click();

    cy.wait(500);

    cy.get("#purchase-submit").click();

    cy.wait(1500);

    cy.goodEvents()
      .hasEventType("transaction", "rb")
      .eventDetails("tr_orderid", "ABC-123")
      .eventDetails("tr_total", 600);

    cy.goodEvents()
      .hasEventType("transaction_item", "rb")
      .eventDetails("ti_orderid", "ABC-123")
      .eventDetails("ti_sku", "SKI-BL123-M")
      .eventDetails("ti_name", "Blue skis (size M)")
      .eventDetails("ti_price", 300)
      .eventDetails("ti_quantity", 2);
  });
});
