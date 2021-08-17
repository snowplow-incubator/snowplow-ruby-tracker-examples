describe("Self-describing event", () => {
  beforeEach(() => {
    cy.resetMicro();
  });

  it("is correctly emitted by JS tracker for basket add activity", () => {
    cy.visit("shop/brown_skis");
    cy.get("#basket-add-form").click();

    cy.wait(1500);

    cy.goodEvents()
      // Self-describing events are called "unstruct" in the event data
      // For legacy reasons
      .hasEventType("unstruct", "js")
      .eventSchema(
        "iglu:test.example.iglu/basket_action_event/jsonschema/1-0-0"
      )
      .contextSchema("iglu:test.example.iglu/product_entity/jsonschema/1-0-0");

    cy.goodEvents()
      .hasEventType("unstruct", "js")
      .selfDescribingEventData("action", "add");

    cy.goodEvents()
      .hasEventType("unstruct", "js")
      .selfDescribingContextData(
        "iglu:test.example.iglu/product_entity/jsonschema/1-0-0",
        "sku",
        "SKI-BR555-M"
      );
  });
});
