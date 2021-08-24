class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  # POST
  def track_page_view
    # Cookie information is only available within Controllers.
    # Here we are passing the domain_userid, based on the Snowplow cookie,
    # to the Snowplow object to set.

    # Page title is a required argument for track page view.
    # However, the server doesn't automatically have this information.
    # This is one small reason why page views are easier to track client-side.
    page_title = nil
    Snowplow.instance.tracker(snowplow_domain_userid).track_page_view(request.original_url, page_title,
                                                                      request.headers["Referer"])
  end

  def snowplow_domain_userid
    # The JavaScript tracker sets a first party cookie.
    # It can be easier to model the data if the client-side and server-side
    # trackers have the same domain_userid.
    # This method extracts the domain_userid from the cookie.
    # The Ruby tracker does not automatically set a domain_userid.
    sp_cookie = cookies.find { |key, _value| key =~ /^_sp_id/ }
    sp_cookie.last.split(".").first if sp_cookie.present?
  end
end
