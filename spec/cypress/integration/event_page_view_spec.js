describe("Page views", () => {
  beforeEach(() => {
    cy.resetMicro();
  });

  it("have correct URL and title", () => {
    cy.visit("/");

    // allow time for the events to be collected by Micro
    cy.wait(2000);

    // Page views are emitted by the JS and Ruby trackers
    cy.goodEvents().hasEventType("page_view", "js").count(1);
    cy.goodEvents().hasEventType("page_view", "rb").count(1);

    cy.goodEvents().hasEventType("page_view", "js").eventDetails({
      page_urlpath: "/",
      page_title: "Rails Example: Home",
    });
    cy.goodEvents()
      .hasEventType("page_view", "rb")
      .eventDetails({ page_url: "http://localhost:5017/", page_urlpath: "/" });
  });

  it("have correct referrer", () => {
    cy.visit("/home/about");
    cy.wait(2000);
    cy.get("[data-cy=shop-navbar]").click();

    // allow time for the events to be collected by Micro
    cy.wait(2000);
    cy.goodEvents().eventDetails({
      page_url: "http://localhost:5017/shop/all_products",
      page_referrer: "http://localhost:5017/home/about",
    });
  });
});
