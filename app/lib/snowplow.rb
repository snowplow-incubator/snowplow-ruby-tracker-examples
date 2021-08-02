# frozen_string_literal: true

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
