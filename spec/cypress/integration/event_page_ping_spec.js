describe("Page ping", () => {
  it("fires as expected", () => {
    cy.resetMicro();

    // Page pings are currently configured to fire every 10s
    // Configured here: app/views/shared/_js_tracker.html.erb
    // Visit a page, produce activity within 10s
    cy.visit("/shop/all_products");
    cy.wait(3000);
    cy.scrollTo(0, 200);
    cy.wait(3000);
    cy.scrollTo(0, -200);
    cy.wait(3000);
    cy.get(".product-img").click();
    cy.wait(3000);

    cy.goodEvents()
      .hasEventType("page_ping", "js")
      .eventDetails("page_urlpath", "/shop/all_products");
  });
});
