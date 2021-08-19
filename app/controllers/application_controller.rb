class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  # POST
  def track_page_view
    page_title = nil
    Snowplow.instance.tracker.track_page_view(request.original_url, page_title, request.headers["Referer"])
  end
end
