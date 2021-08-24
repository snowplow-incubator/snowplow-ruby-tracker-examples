# frozen_string_literal: true

require "snowplow-tracker"
require "singleton"

class Snowplow
  include Singleton

  def tracker(domain_userid = "")
    return @tracker unless @tracker.nil?

    @tracker = SnowplowTracker::Tracker.new(emitter)

    # The Ruby tracker does not automatically set a domain_userid.
    # Here, the JavaScript tracker's domain_userid has been passed in as an
    # argument to the tracker during track_page_view, in ApplicationController.
    if !domain_userid.empty? && @domain_userid_set.nil?
      @tracker.set_domain_user_id(domain_userid)
      @domain_userid_set = true
    end
    @tracker
  end

  # --------------------------------------
  private

  def emitter
    return @emitter unless @emitter.nil?

    @emitter = SnowplowTracker::AsyncEmitter.new("localhost:9090")
  end
end
