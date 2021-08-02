# frozen_string_literal: true

require "snowplow-tracker"
require "singleton"

class Tracker
  include Singleton

  def page_view(page_url, referrer)
    page_title = nil
    tracker.track_page_view(page_url, page_title, referrer)
  end

  def screen_view(name, id)
    tracker.track_screen_view(name, id)
  end

  def ecommerce(transaction, items)
    tracker.track_ecommerce_transaction(transaction, items)
  end

  def struct(category, action)
    tracker.track_struct_event(category, action)
  end

  def self_describing(schema, event_properties)
    event_json = SnowplowTracker::SelfDescribingJson.new(
      schema, event_properties
    )
    tracker.track_self_describing_event(event_json)
  end

  # --------------------------------------
  private

  def tracker
    return @tracker unless @tracker.nil?

    @tracker = SnowplowTracker::Tracker.new(emitter)
  end

  def emitter
    return @emitter unless @emitter.nil?

    @emitter = SnowplowTracker::AsyncEmitter.new("localhost:9090")
  end
end
