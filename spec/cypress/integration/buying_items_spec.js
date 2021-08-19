describe("Buying from the shop", () => {
  it("View item page, add to basket and purchase", () => {
    cy.visit("/");
    cy.get("[data-cy=shop-navbar]").click();
    cy.contains("Green skis").click();

    cy.get("#purchase-submit").should("be.disabled");

    cy.get("#basket-add-form").click();
    cy.get("#order-total").should("have.text", "449.99");

    cy.go("back");
    cy.get(".white_poles > #basket-add-form").click();
    cy.get("#order-total").should("have.text", "509.79");

    cy.get("#purchase-submit").click();
    cy.url().should("include", "/home/confirmation");
  });
});
