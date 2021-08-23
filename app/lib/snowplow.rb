# frozen_string_literal: true

require "snowplow-tracker"
require "singleton"

class Snowplow
  include Singleton

  def tracker(domain_userid = nil)
    @tracker = SnowplowTracker::Tracker.new(emitter) if @tracker.nil?

    # The Ruby tracker does not automatically set a domain_userid.
    # Here, the JavaScript tracker's domain_userid has been passed in as an
    # argument to the tracker during track_page_view, in ApplicationController.
    @tracker.set_domain_user_id(domain_userid) unless domain_userid.nil?
    @tracker
  end

  # --------------------------------------
  private

  def emitter
    return @emitter unless @emitter.nil?

    @emitter = SnowplowTracker::AsyncEmitter.new("localhost:9090")
  end
end
