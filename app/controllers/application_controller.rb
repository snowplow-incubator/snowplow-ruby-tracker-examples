class ApplicationController < ActionController::Base
  # POST
  def track_page_view
    page_title = nil
    Snowplow.instance.tracker.track_page_view(request.original_url, page_title, request.headers["Referer"])
  end
end
