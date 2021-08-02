class HomeController < ApplicationController
  after_action :track_page_view, only: %i[index about shop]

  def index
  end

  def about
  end

  def shop
  end

  # POST
  def track_self_describing
    schema = "iglu:test.example.iglu/skiing_turn/jsonschema/1-0-0"
    event_json = SnowplowTracker::SelfDescribingJson.new(
      schema, { turnType: "snowplough" }
    )
    Snowplow.instance.tracker.track_self_describing_event(event_json)
  end

  # POST
  def track_page_view
    page_title = nil
    Snowplow.instance.tracker.track_page_view(request.original_url, page_title, request.headers["Referer"])
  end

  # POST
  def track_screen_view
    Snowplow.instance.tracker.track_screen_view(params[:name], params[:id])
  end

  # POST
  def track_ecommerce
    transaction = {
                    "order_id" => "12345",
                    "total_value" => 80.99,
                    "currency" => "EUR"
                  }
    items = [{
               "sku" => "ex0099",
               "price" => 20,
               "quantity" => 3,
               "category" => "bulbs"
             },
             {
               "sku" => "ex0361",
               "price" => 20.99,
               "quantity" => 1,
               "name" => "watering can"
             }]
    Snowplow.instance.tracker.track_ecommerce_transaction(transaction, items)
  end

  # POST
  def track_struct
    Snowplow.instance.tracker.track_struct_event("test_event", "click")
  end
end
