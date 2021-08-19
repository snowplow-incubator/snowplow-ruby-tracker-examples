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
    return response.body;
  });
});

Cypress.Commands.add("goodEvents", () => {
  cy.request(GOODEND).then((response) => {
    return response.body;
  });
});

Cypress.Commands.add("resetMicro", () => {
  cy.request(RESETEND).then((response) => {
    if (response.body.total === 0) {
      assert(true, `Cleared all events from Micro`);
    }
  });
});

Cypress.Commands.add("count", { prevSubject: "true" }, (subject, num) => {
  if (subject.length === num) {
    assert(true, `count: there are ${num} event(s), as expected`);
  } else {
    assert(false, `count: expected ${num} event(s), found ${subject.length}`);
  }
  return subject;
});

Cypress.Commands.add(
  "hasEventType",
  { prevSubject: "true" },
  (events, type, language) => {
    const filtered = events.filter((event) => {
      const trackerLanguage = event.event.v_tracker.slice(0, 2);
      return event.eventType === type && trackerLanguage === language;
    });

    if (filtered.length > 0) {
      assert(true, `hasEventType: ${language} ${type} event(s) are present`);
    } else {
      assert(false, `hasEventType: no ${language} ${type} events`);
    }
    console.log(filtered);
    return filtered;
  }
);

Cypress.Commands.add(
  "eventDetails",
  { prevSubject: "true" },
  (events, key, value) => {
    const filtered = events.filter((event) => {
      return event.event[key] === value;
    });

    if (filtered.length > 0) {
      assert(
        true,
        `eventDetails: event(s) have parameter "${key}" with expected value`
      );
    } else {
      const paramCheck = events.filter((event) => {
        return event.event[key] !== undefined;
      });
      if (paramCheck.length === 0) {
        assert(false, `eventDetails: no events with parameter "${key}" found`);
      } else {
        assert(
          false,
          `eventDetails: no events found with "${key}": "${value}"`
        );
      }
    }
    console.log(filtered);
    return filtered;
  }
);

Cypress.Commands.add(
  "eventSchema",
  { prevSubject: "true" },
  (events, schema) => {
    const filtered = events.filter((event) => {
      return event.schema === schema;
    });

    if (filtered.length > 0) {
      assert(true, `eventSchema: event(s) have the expected schema`);
    } else {
      assert(false, `eventSchema: no events with expected schema`);
    }
    return filtered;
  }
);

Cypress.Commands.add(
  "selfDescribingEventData",
  { prevSubject: "true" },
  (events, key, value) => {
    const filtered = events.filter((event) => {
      return event.event.unstruct_event.data.data[key] === value;
    });
    if (filtered.length > 0) {
      assert(
        true,
        `selfDescribingEventData: event(s) have custom parameter "${key}" with expected value`
      );
    } else {
      assert(
        false,
        `selfDescribingEventData: no events with expected parameter and/or value`
      );
    }
    return filtered;
  }
);

Cypress.Commands.add(
  "selfDescribingContextData",
  { prevSubject: "true" },
  (event, key, value) => {
    console.log(`the events list is ${event.length} long`);
    console.log(event);
    if (event.length > 1) {
      assert(false, "selfDescribingContextData can only test 1 event");
    }
    // Assumes only one event is being assessed??!??!?!??!
    const contexts = event[0].event.contexts.data;
    const filtered = contexts.filter((context) => {
      return context.data[key] === value;
    });
    if (filtered.length > 0) {
      assert(
        true,
        `selfDescribingContextData: event has context/entity with correct schema, custom parameter "${key}", and expected value`
      );
    } else {
      assert(
        false,
        `selfDescribingContextData: event does not have expected context/entity parameters`
      );
    }
    return event;
  }
);

Cypress.Commands.add(
  "contextSchema",
  { prevSubject: "true" },
  (events, schema) => {
    const filtered = events.filter((event) => {
      return event.contexts.includes(schema);
    });
    if (filtered.length > 0) {
      assert(
        true,
        `contextSchema: event(s) have expected context/entity schema`
      );
    } else {
      assert(
        false,
        `contextSchema: no events with expected context/entity schema`
      );
    }
    return filtered;
  }
);
