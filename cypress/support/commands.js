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
// These custom Cypress Commands enable testing of events collected by Snowplow Micro.
// This is an example only, feel free to approach testing in your own way.

// Snowplow Micro API endpoints
const GOODEND = "http://localhost:9090/micro/good";
const BADEND = "http://localhost:9090/micro/bad";
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
    return filtered;
  }
);

Cypress.Commands.add(
  "eventDetails",
  { prevSubject: "true" },
  (events, parameters) => {
    const filtered = events.filter((event) => {
      const matchedParameters = Object.keys(parameters).map((key) => {
        return event.event[key] === parameters[key];
      });
      const matchedUnique = [...new Set(matchedParameters)];
      return matchedUnique.length === 1 && matchedUnique[0] === true;
    });

    if (filtered.length > 0) {
      assert(true, `eventDetails: event(s) present with expected parameters`);
    } else {
      assert(false, `eventDetails: no events matching all given parameters`);
    }
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
  (events, parameters) => {
    const filtered = events.filter((event) => {
      const matchedParameters = Object.keys(parameters).map((key) => {
        return event.event.unstruct_event.data.data[key] === parameters[key];
      });
      const matchedUnique = [...new Set(matchedParameters)];
      return matchedUnique.length === 1 && matchedUnique[0] === true;
    });

    if (filtered.length > 0) {
      assert(
        true,
        `selfDescribingEventData: event(s) present with expected parameters`
      );
    } else {
      assert(
        false,
        `selfDescribingEventData: no events matching all given parameters`
      );
    }
    return filtered;
  }
);

Cypress.Commands.add(
  "selfDescribingContextData",
  { prevSubject: "true" },
  (event, parameters) => {
    if (event.length > 1) {
      assert(false, "selfDescribingContextData can only test 1 event");
    }

    const filtered = event[0].event.contexts.data.filter((context) => {
      const matchedParameters = Object.keys(parameters).map((key) => {
        return context.data[key] === parameters[key];
      });
      const matchedUnique = [...new Set(matchedParameters)];
      return matchedUnique.length === 1 && matchedUnique[0] === true;
    });

    if (filtered.length > 0) {
      assert(
        true,
        `selfDescribingContextData: event has attached context/entity with expected parameters`
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
