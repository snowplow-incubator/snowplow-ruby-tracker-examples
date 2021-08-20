describe("Self-describing event", () => {
  beforeEach(() => {
    cy.resetMicro();
  });

  // it("is correctly emitted by JS tracker for basket add activity", () => {
  //   cy.visit("shop/brown_skis");
  //   cy.get("#basket-add-form").click();

  //   cy.wait(2000);

  //   cy.goodEvents()
  //     // Self-describing events are called "unstruct" in the event data
  //     // for legacy reasons.
  //     .hasEventType("unstruct", "js")
  //     .eventSchema(
  //       "iglu:test.example.iglu/basket_action_event/jsonschema/1-0-0"
  //     )
  //     .contextSchema("iglu:test.example.iglu/product_entity/jsonschema/1-0-0");

  //   cy.goodEvents()
  //     .hasEventType("unstruct", "js")
  //     .selfDescribingEventData("action", "add");

  //   cy.goodEvents()
  //     .hasEventType("unstruct", "js")
  //     .count(1)
  //     .selfDescribingContextData("sku", "SKI-BR555-M");
  // });

  it("is emitted by Ruby tracker for purchase activity", () => {
    cy.visit("/shop/all_products");
    cy.get(".green_skis > #basket-add-form").click();
    cy.get(".green_skis > #basket-add-form").click();
    cy.get(".white_poles > #basket-add-form").click();

    cy.wait(1000);

    cy.get("#purchase-submit").click();

    cy.wait(1500);

    cy.goodEvents()
      .hasEventType("unstruct", "rb")
      .eventSchema("iglu:test.example.iglu/purchase_event/jsonschema/1-0-0")
      .selfDescribingEventData("order_id", "ABC-123")
      .selfDescribingEventData("total_value", 959.78);

    cy.goodEvents()
      .hasEventType("unstruct", "rb")
      .contextSchema("iglu:test.example.iglu/product_entity/jsonschema/1-0-0")
      .selfDescribingContextData("name", "Green skis (size S)")
      .selfDescribingContextData("name", "Ski poles (white)");
  });
});
