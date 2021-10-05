class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  def snowplow_domain_userid
    # The JavaScript tracker sets first party cookies.
    # It can be easier to model the data if the client-side and server-side
    # trackers give the same domain_userid to their events.
    # This method extracts the domain_userid from the cookie.
    # The Ruby tracker does not automatically set a domain_userid.
    sp_cookie = cookies.find { |key, _value| key =~ /^_sp_id/ }
    sp_cookie.last.split(".").first if sp_cookie.present?
  end

  # POST
  def track_page_view
    # Here we are passing the domain_userid to the Snowplow object to set.
    # This is not essential for the Ruby tracker functionality.
    # Cookie information is only available within Controllers.

    # Page title is an optional argument for track_page_view.
    # However, the server doesn't automatically have this information.
    # This is one small reason why page views are easier to track client-side.
    # Conversely, server-side page view tracking is more accurate, as it is not
    # blocked by adblockers.
    # It can be useful to compare counts from client- and server-side page views
    # to see how much effect adblockers are having.
    page_title = nil
    Snowplow.instance.tracker(snowplow_domain_userid).track_page_view(page_url: request.original_url,
                                                                      page_title: page_title,
                                                                      referrer: request.headers["Referer"])
  end
end
