// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const BADEND = "http://localhost:9090/micro/bad";
const GOODEND = "http://localhost:9090/micro/good";
const RESETEND = "http://localhost:9090/micro/reset";

Cypress.Commands.add("badEvents", () => {
  cy.request(BADEND).then((response) => {
    // assert(true, "Checking for bad events");
    return response.body;
  });
});

Cypress.Commands.add("goodEvents", () => {
  cy.request(GOODEND).then((response) => {
    // assert(true, "Checking for good events");
    return response.body;
  });
});

Cypress.Commands.add("resetMicro", () => {
  cy.request(RESETEND);
  assert(true, "Cleared all events");
});

Cypress.Commands.add("count", { prevSubject: "true" }, (subject, num) => {
  expect(subject.length).to.equal(num);
});

Cypress.Commands.add(
  "hasEventType",
  { prevSubject: "true" },
  (events, type, language) => {
    console.log(`here in hasEventType: ${type} and ${language}`);

    return events.filter((event) => {
      const trackerLanguage = event.event.v_tracker.slice(0, 2);
      return event.eventType === type && trackerLanguage === language;
    });
  }
);

Cypress.Commands.add(
  "eventDetails",
  { prevSubject: "true" },
  (events, key, value) => {
    console.log(`here in eventDetails: ${key} and ${value}`);

    const filtered = events.filter((event) => {
      console.log(key);
      console.log(event.event[key]);
      return event.event[key] === value;
    });
    // assert(true, `Count events with event field '${key}' and value '${value}'`);
    expect(filtered.length).not.to.equal(0);
  }
);
