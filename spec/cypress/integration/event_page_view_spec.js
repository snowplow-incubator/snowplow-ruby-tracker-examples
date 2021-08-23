describe("Page views", () => {
  beforeEach(() => {
    cy.resetMicro();
  });

  it("have correct URL and title", () => {
    cy.visit("/");

    // allow time for the events to be collected by Micro
    cy.wait(1500);

    // Page views are emitted by the JS and Ruby trackers
    cy.goodEvents().hasEventType("page_view", "rb").count(1);
    cy.goodEvents().hasEventType("page_view", "js").count(1);

    cy.goodEvents()
      .hasEventType("page_view", "rb")
      .eventDetails({ page_url: "http://localhost:5017/" });
    cy.goodEvents()
      .hasEventType("page_view", "js")
      .eventDetails({ page_title: "Rails Example: Home" });
  });

  it("have correct referrer", () => {
    cy.visit("/home/about");
    cy.get("[data-cy=shop-navbar]").click();

    cy.wait(1500);
    cy.goodEvents().eventDetails({
      page_referrer: "http://localhost:5017/home/about",
    });
  });
});
