# Snowplow Ruby tracker examples

An example of how to incorporate [Snowplow](https://snowplowanalytics.com/) trackers (SDKs) into a Rails project.

## Table of Contents

## Quick Start

The [Ruby](https://github.com/snowplow/snowplow-ruby-tracker) and [JavaScript](https://github.com/snowplow/snowplow-javascript-tracker) trackers are configured to use [Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro) as the event collector. The Micro config files are included in the `snowplow-micro` folder.

Start Micro:

```
docker run --mount type=bind,source=$(pwd)/snowplow-micro,destination=/config -p 9090:9090 snowplow/snowplow-micro:1.1.2 --collector-config /config/micro.conf --iglu /config/iglu.json
```

Requirements: Ruby 3.0, Yarn, Bundle, and Cypress.  
Install project dependencies: `yarn install` and `bundle install`  
Run: `rails s`  
Interact with the site to generate events.

Run Rails tests: `rspec`  
Run Cypress integration tests:

```
bundle exec rails server -e test -p 5017

# Opens the Cypress UI for headed testing
yarn cypress open --project ./spec

# Or run the tests headless
yarn cypress run --project ./spec
```

## Tracking Design and Implementation

### Demo app

The Snowplow shop sells skiing equipment. The company wants to understand how much traffic their website gets, and how users move through the site. In the shop, they want to track when a product is added to the shopping basket, and when they are purchased.

Both the Ruby and JavaScript Snowplow tracker SDKs are included in this app, for server-side and client-side tracking. This allows tracking of events in the most appropriate way for each event. For example, page views are best tracked client-side, as the client has easy access to information about e.g. IP address. Conversely, CRUD actions or activities such as purchasing, which are processed by the server, should be tracked server-side. Read more about designing tracking in the [Snowplow docs](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/introduction-to-tracking-design/).

This demo does not include any authentication or database functionality.

### Ruby tracker

The [Ruby tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/ruby-tracker/) is imported as a gem.

```
# in Gemfile
gem "snowplow-tracker", "~> 0.6.0"
```

The tracker is written as a Singleton global object, to avoid reinitializing new Trackers and Emitters on every page load. The tracker code is found in `app/lib/tracker.rb` (only files within `app` auto-reload, so for ease of development the `app/lib` folder is used here instead of `lib`).

```
require "snowplow-tracker"
require "singleton"

class Snowplow
  include Singleton

  def tracker
    return @tracker unless @tracker.nil?

    @tracker = SnowplowTracker::Tracker.new(emitter)
  end

  # --------------------------------------
  private

  def emitter
    return @emitter unless @emitter.nil?

    @emitter = SnowplowTracker::AsyncEmitter.new("localhost:9090")
  end
end
```

### JavaScript tracker

The [JavaScript tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/) is included via script tags in the shared `application.html.erb` header. The script code is stored in the `_js_tracker.html.erb` view partial.

```

```

Further examples of custom event tracking with the JS tracker can be found in the [Snowplow Micro examples](https://github.com/snowplow-incubator/snowplow-micro-examples) demo Django app.

## Event types

The [Ruby tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/ruby-tracker/) has several specific event types available out-of-the-box. Of these, Page Views and eCommerce events are demonstrated here.

However, for all tracker SDKs we strongly recommend using custom Self-Describing events. These are defined by "self-describing" JSON schema rulesets. As the schema are fully customisable, it's possible to track any number of metrics that are important to you.

Every event can also have an arbitrary number of Entities attached, which are also self-describing JSONs. For example, this app includes schemas that define a Purchase event, and a Product entity.

Read more [about event data structures](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/) on the Snowplow blog.

## Testing using Snowplow Micro

fff
