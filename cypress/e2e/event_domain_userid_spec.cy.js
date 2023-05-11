describe("Page views", () => {
  it("set the domain_userid for Ruby events", () => {
    cy.resetMicro();

    cy.visit("/");
    cy.wait(2000);
    cy.visit("/home/about");

    // allow time for the events to be collected by Micro
    cy.wait(2000);

    let jsDomainUserId;
    cy.getCookies()
      .then((cookies) => {
        for (const cookie of cookies) {
          if (cookie.name.match(/^_sp_id/)) {
            jsDomainUserId = cookie.value.split(".")[0];
            break;
          }
        }
      })
      .then(() => {
        cy.goodEvents()
          .hasEventType("page_view", "js")
          .eventDetails({ domain_userid: jsDomainUserId });
        cy.goodEvents()
          .hasEventType("page_view", "rb")
          .eventDetails({ domain_userid: jsDomainUserId });
      });
  });
});
