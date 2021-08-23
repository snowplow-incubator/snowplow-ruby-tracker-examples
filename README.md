# Snowplow Ruby tracker examples

An example of how to incorporate [Snowplow](https://snowplowanalytics.com/) trackers (SDKs) into a Rails project.

### Versions used:

**Rails** v6.1.4  
**Ruby tracker** v0.6.1  
**JavaScript tracker** v3.1.0

## Table of Contents

- [Snowplow Ruby tracker examples](#snowplow-ruby-tracker-examples)
    - [Versions used:](#versions-used)
  - [Table of Contents](#table-of-contents)
  - [1. Quick Start](#1-quick-start)
  - [2. Tracking Design and Implementation](#2-tracking-design-and-implementation)
    - [2.1 This demo app](#21-this-demo-app)
    - [2.2 Ruby tracker](#22-ruby-tracker)
    - [2.3 JavaScript tracker](#23-javascript-tracker)
  - [3. Event types and context](#3-event-types-and-context)
  - [4. Matching the domain_userid for both trackers](#4-matching-the-domain_userid-for-both-trackers)
  - [5. Testing using Snowplow Micro](#5-testing-using-snowplow-micro)
  - [6. Further information](#6-further-information)

## 1. Quick Start

**Requirements**: Ruby 3.0, Yarn, Bundle, Docker, and Cypress (for the tests).

Install project dependencies:

```bash
yarn install
bundle install
```

Run the app:

```bash
# To run the app on port 3000
rails server
```

The [Ruby](https://github.com/snowplow/snowplow-ruby-tracker) and [JavaScript](https://github.com/snowplow/snowplow-javascript-tracker) trackers are configured to use [Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro) as the event collector.

Start Micro:

```bash
# run from the root folder of this app

docker run --mount type=bind,source=$(pwd)/snowplow-micro,destination=/config -p 9090:9090 snowplow/snowplow-micro:1.1.2 --collector-config /config/micro.conf --iglu /config/iglu.json
```

Interact with the site to generate events.

Run tests:

```bash
# Rails tests
rspec

# Cypress tests with UI
rails cypress:open

# Cypress tests headless
rails cypress:run
```

## 2. Tracking Design and Implementation

### 2.1 This demo app

This Snowplow shop sells skiing equipment. We want to understand how much traffic the website gets, and how users move through the site. In the shop, we want to track when a product is added to the shopping basket, and when products are purchased.

Both the Ruby and JavaScript Snowplow tracker SDKs are included in this app, for server-side and client-side tracking. This allows tracking of events in the most appropriate way for each event. For example, Page Views are best tracked client-side, as the client has easy access to information about e.g. IP address. Conversely, CRUD actions or activities such as purchasing, which are processed by the server, should be tracked server-side. Read more about designing tracking in the [Snowplow docs](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/introduction-to-tracking-design/).

This demo does not include any authentication or database functionality.

### 2.2 Ruby tracker

The [Ruby tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/ruby-tracker/) is imported as a gem.

```ruby
# in Gemfile

gem "snowplow-tracker", "~> 0.6.0"
```

The tracker is written as a Singleton global object, to avoid reinitializing new Trackers and Emitters on every page load. The tracker set-up code is found in `app/lib/tracker.rb` (only files within `app` auto-reload, so for ease of development the `app/lib` folder is used here instead of `lib`).

```ruby
# in snowplow.rb

require "snowplow-tracker"
require "singleton"

class Snowplow
  include Singleton

  def tracker
    return @tracker unless @tracker.nil?

    @tracker = SnowplowTracker::Tracker.new(emitter)
  end

  private

  def emitter
    return @emitter unless @emitter.nil?

    @emitter = SnowplowTracker::AsyncEmitter.new("localhost:9090")
  end
end
```

Here, Page View tracking is defined, using the Singleton tracker:

```ruby
# in application_controller.rb

def track_page_view
  page_title = nil
  Snowplow.instance.tracker.track_page_view(request.original_url,
                                            page_title,
                                            request.headers["Referer"])
end
```

### 2.3 JavaScript tracker

The tag-based [JavaScript tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/) comes in two parts. The `sp.js` code is found in `public/snowplow` for hosting as part of the app. The script tag is included in the shared `application.html.erb` header.

```html
<! in the head of application.html.erb

<script async="1">
  (function (p, l, o, w, i, n, g) {
    if (!p[i]) {
      p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
      p.GlobalSnowplowNamespace.push(i);
      p[i] = function () {
        (p[i].q = p[i].q || []).push(arguments);
      };
      p[i].q = p[i].q || [];
      n = l.createElement(o);
      g = l.getElementsByTagName(o)[0];
      n.async = 1;
      n.src = w;
      g.parentNode.insertBefore(n, g);
    }
  })(
    window,
    document,
    "script",
    "<%= root_url + 'snowplow/sp.js' %>",
    "snowplow"
  );

  snowplow("newTracker", "sp", "0.0.0.0:9090");

  snowplow("enableActivityTracking", {
    minimumVisitLength: 10,
    heartbeatDelay: 10,
  });
  snowplow("trackPageView");
</script>
```

This code initialises a JavaScript tracker, as well as setting up Page View and Page Ping (activity) events. Read more about the JavaScript tracker SDK events [here](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/). Further examples of custom event tracking with the JS tracker can be found in the [Snowplow Micro examples](https://github.com/snowplow-incubator/snowplow-micro-examples) demo Django app.

## 3. Event types and context

The [Ruby tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/ruby-tracker/) has several specific event types available out-of-the-box. Of these, Page Views and eCommerce events are demonstrated here.

However, for all tracker SDKs we strongly recommend using custom Self-Describing events. These are defined by "self-describing" JSON schema rulesets. As the schema are fully customisable, it's possible to track any number of metrics that are important to you. Read more [about event data structures](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/) on the Snowplow blog and in the [documentation](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/understanding-events-entities/).

Each Snowplow event has the option of adding contextual information, by the attachment of entities. The attached entities are called the context of the event. Like the events themselves, entities are defined by self-describing JSON schemas. For example, this app includes schemas that define a Purchase event, and a Product entity. You can see that the schemas are very similar.

```json
// example schema for a Purchase event

{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for a purchase event",
  "self": {
    "vendor": "test.example.iglu",
    "name": "purchase_event",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "order_id": {
      "description": "Order ID",
      "type": "string",
      "maxLength": 64
    },
    "total_value": {
      "description": "Sum of product prices in the order",
      "type": "number",
      "minimum": 0,
      "maximum": 100000
    },
    "price_reduced": {
      "description": "Does this order include items whose price has been reduced?",
      "type": ["boolean", "null"]
    }
  },
  "required": ["order_id", "total_value"],
  "additionalProperties": false
}
```

This event would have a product entity attached for each product in the order.

```json
// example schema for a product entity

{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for a product entity",
  "self": {
    "vendor": "test.example.iglu",
    "name": "product_entity",
    "format": "jsonschema",
    "version": "1-0-1"
  },
  "type": "object",
  "properties": {
    "sku": {
      "description": "Product SKU",
      "type": "string",
      "maxLength": 64
    },
    "name": {
      "description": "Product name",
      "type": ["string"],
      "maxLength": 255
    },
    "price": {
      "description": "Price of product at point of sale",
      "type": "number",
      "minimum": 1,
      "maximum": 10000
    },
    "on_sale": {
      "description": "Has the price been reduced since it was first offered?",
      "type": ["boolean", "null"]
    },
    "orig_price": {
      "description": "Original selling price",
      "type": ["number", "null"],
      "minimum": 1,
      "maximum": 10000
    },
    "quantity": {
      "description": "Quantity of this product",
      "type": "integer",
      "minimum": 1,
      "maximum": 10000
    }
  },
  "required": ["sku", "name", "price", "quantity", "on_sale", "orig_price"],
  "additionalProperties": false
}
```

This product entity schema is version 1-0-1, as a non-breaking change has been made since the first version. Read more about schema versioning [here](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/versioning-your-data-structures/) and [here](https://docs.snowplowanalytics.com/docs/pipeline-components-and-applications/iglu/common-architecture/schemaver/).

The self-describing JSON schemas are validated by part of the Snowplow data collection pipeline called [Iglu](https://docs.snowplowanalytics.com/docs/pipeline-components-and-applications/iglu/). Read about how to lint the schemas with IgluCTL [here](https://docs.snowplowanalytics.com/docs/pipeline-components-and-applications/iglu/igluctl-2/).

Below is Ruby code that creates a purchase event based off these schemas:

```ruby
# Based on code in app/shop_controller.rb

event_schema = "iglu:test.example.iglu/purchase_event/jsonschema/1-0-0"
entity_schema = "iglu:test.example.iglu/product_entity/jsonschema/1-0-1"

transaction = { "order_id": "ABC-123", "total_value": 40.99 }
ordered_products = [product1_hash, product2_hash]

purchase_json = SnowplowTracker::SelfDescribingJson.new(
  event_schema, transaction
)
context = ordered_products.map do |product|
  SnowplowTracker::SelfDescribingJson.new(entity_schema, product)
end
Snowplow.instance.tracker.track_self_describing_event(purchase_json, context)
```

Every event sent by the JavaScript tracker (v3+) automatically includes a [web page entity](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/#webPage_context), whose sole parameter is an ID unique to that page load. This context helps data modelling by allowing the easy identification of events that occurred on the same loaded page. Of course, personalised custom entities can be attached to any event type in addition to the web page entity, to create richer context data.

Events from the Ruby tracker do not have any automatically included context.

## 4. Matching the domain_userid for both trackers

The JavaScript tracker sets and uses [cookies](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/cookies-local-storage/). One of the stored identifiers is the `domain_userid`, a unique identifier for each user. Every event sent from the JavaScript tracker includes this information.

The Ruby tracker, by default, does not attach `domain_userid` information to its events. Providing the Ruby tracker with the same `domain_userid` set by the JavaScript tracker can be extremely helpful for modelling the data. It makes it easy to understand which client-side and server-side events were generated by the same user.

The `domain_userid` can be extracted from the cookie as follows. Note that only Rails Controllers can access cookies.

```ruby
# in ApplicationController

def snowplow_domain_userid
  sp_cookie = cookies.find { |key, _value| key =~ /^_sp_id/ }
  sp_cookie.last.split(".").first if sp_cookie.present?
end
```

A third-party gem, [snowplow_ruby_duid](https://github.com/simplybusiness/snowplow_ruby_duid) is available that provides this functionality plus further configuration options.

The Ruby tracker `domain_userid` is set using the Snowplow method `set_domain_user_id`. Read more about this [here](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/ruby-tracker/adding-extra-data/).

```ruby
# in snowplow.rb

@tracker.set_domain_user_id(domain_userid)
```

In this app, we have linked the Ruby Page View tracking to setting the `domain_userid`. Since the cookies are set by the JavaScript tracker, the very first Ruby Page View event may lack the `domain_userid` if the JavaScript tracker has not yet finished inititalising and creating the cookie.

## 5. Testing using Snowplow Micro

To confirm that the trackers have been configured correctly, Snowplow provides a minimal data collection pipeline called [Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro). Micro collects emitted events, and provides an API to analyse them. The Micro config files are included in the `snowplow-micro` folder. The file `iglu.json` informs the schema validator [Iglu](https://github.com/snowplow/iglu) where to find the schemas. For this demo, this GitHub repository is listed directly as an Iglu repository. Read more about Iglu repositories [here](https://docs.snowplowanalytics.com/docs/pipeline-components-and-applications/iglu/iglu-repositories/).

To start Micro using Docker. The standard port is 9090, configured in the `micro.conf` configuration file.

```bash
# run from the root folder of this app

docker run --mount type=bind,source=$(pwd)/snowplow-micro,destination=/config -p 9090:9090 snowplow/snowplow-micro:1.1.2 --collector-config /config/micro.conf --iglu /config/iglu.json
```

Snowplow Micro provides four API endpoints, `micro/all`, `micro/good`, `micro/bad`, and `micro/reset`. Visit them in your client at e.g. `http://localhost:9090/micro/good`.

In this app, we use the testing library [Cypress](https://www.cypress.io/) to test event collection. We defined a set of custom Cypress Commands in `spec/cypress/support/commands.js` that relate to Snowplow events. For example, here is a test for a self-describing (custom) purchase event:

```javascript
// in spec/cypress/integration/event_self_describing_spec.js
// with added comments

it("is emitted by Ruby tracker for purchase activity", () => {
  cy.visit("/shop/all_products");

  // Adding products to the shopping basket
  cy.get(".green_skis > #basket-add-form").click();
  cy.get(".green_skis > #basket-add-form").click();
  cy.get(".white_poles > #basket-add-form").click();

  // Wait to make sure the basket additions have finished
  cy.wait(1000);

  // "Buy" the items
  cy.get("#purchase-submit").click();

  // Allow time for the events to be collected by Micro
  cy.wait(2000);

  // The badEvents() custom command queries the "/micro/bad" API endpoint
  // and returns all the bad events.
  // The count() custom command compares the given argument
  // with the length of the given array
  cy.badEvents().count(0);

  // The goodEvents() custom command queries the "/micro/good" API endpoint
  // and returns all the good events.
  // The other custom commands check for events which match the arguments given
  cy.goodEvents()
    // Self-describing events are also called "unstruct" events
    // for legacy reasons
    .hasEventType("unstruct", "rb")
    .eventSchema("iglu:test.example.iglu/purchase_event/jsonschema/1-0-0")
    .selfDescribingEventData({ order_id: "ABC-123", total_value: 959.78 });

  cy.goodEvents()
    .hasEventType("unstruct", "rb")
    .contextSchema("iglu:test.example.iglu/product_entity/jsonschema/1-0-1")
    .selfDescribingContextData({
      name: "Green skis (size S)",
      quantity: 2,
      price: 449.99,
    })
    .selfDescribingContextData({ name: "Ski poles (white)" });
});
```

We recommend designing your own tests, based on your own app, tracking, and needs. These tests are provided as one example of event testing using Cypress and Snowplow Micro. See the [Snowplow Micro examples](https://github.com/snowplow-incubator/snowplow-micro-examples) repository for a more comprehensive example of testing. Other e2e/integration testing libraries can also be used.

## 6. Further information

Detailed information about behavioural data management, and Snowplow tracking and data collection pipelines can be found on the Snowplow [ website](https://snowplowanalytics.com/), [blog](https://snowplowanalytics.com/blog/), [knowledge base](https://snowplowanalytics.com/knowledge-base/) and in the [documentation](https://docs.snowplowanalytics.com/).

The skiing equipment image used in this app is from [Pexels](https://www.pexels.com), and is by Pixabay.
