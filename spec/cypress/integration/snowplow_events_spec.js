// sending page view events with Ruby and JS

describe("Snowplow events", () => {
  it("Page views have correct URL and title", () => {
    cy.resetMicro();

    cy.visit("/");

    // allow time for the events to be collected by Micro
    cy.wait(1000);

    cy.badEvents().count(0);

    cy.goodEvents().hasEventType("page_view", "rb").count(1);
    cy.goodEvents().hasEventType("page_view", "js").count(1);

    cy.goodEvents().eventDetails("page_url", "http://localhost:5017/");
    cy.goodEvents()
      .hasEventType("page_view", "js")
      .eventDetails("page_title", "Rails Example: Home");
  });

  it("Page views have correct referrer", () => {
    cy.resetMicro();

    cy.visit("/home/about");

    // change this line, put test attribute on the button for this
    cy.contains("Shop").click();

    cy.wait(1000);
    cy.goodEvents().eventDetails(
      "page_referrer",
      "http://localhost:5017/home/about"
    );
  });
});
