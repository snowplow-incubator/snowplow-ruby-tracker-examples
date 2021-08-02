# Snowplow Ruby tracker example

An example of how to incorporate [Snowplow](https://snowplowanalytics.com/) trackers (SDKs) into a Rails project.

### Quick Start

The [Ruby](https://github.com/snowplow/snowplow-ruby-tracker) and [JavaScript](https://github.com/snowplow/snowplow-javascript-tracker) trackers are configured to use [Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro) as event collector. The Micro config files are included in the `snowplow-micro` folder.

Start Micro:

```
docker run --mount type=bind,source=$(pwd)/snowplow-micro,destination=/config -p 9090:9090 snowplow/snowplow-micro:1.1.2 --collector-config /config/micro.conf --iglu /config/iglu.json
```

Install dependencies: `bundle`  
Run: `rails s`  
Run tests: `rspec`

Interact with the site to generate events. Confirm that events have been collected by Micro at `localhost:9090/micro/all`, `/good` or `/bad`.

### Tracking Design

This simple app has three pages. The start-up page has buttons for each of the different event types provided by the Ruby tracker. The About and History pages mainly exist to allow page view events to be generated and emitted by the JavaScript and Ruby trackers.

The Ruby tracker is structured as a Singleton global object, to avoid reinitializing new Trackers and Emitters on every page load. Check out the [Documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/ruby-tracker/) to read about the different event types, and the additional parameters that can be sent with each. The tracker code is found in `app/lib/tracker.rb` (only files within `app` auto-reload, so for ease of development the `app/lib` folder is used here instead of `lib`).

The JavaScript tracker ([Docs](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/)) is included via script tags in the shared `application.html.erb` header. Examples of custom event tracking with the JS tracker can be found in the [Snowplow Micro examples](https://github.com/snowplow-incubator/snowplow-micro-examples) repo.

### Testing

Currently some basic Rails tests are included, using Rspec. There are no e2e tests or tests for event emission yet. I intend to include Cypress tests similar to those in the Micro Examples repo.
