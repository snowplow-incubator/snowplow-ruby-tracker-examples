class ShopController < ApplicationController
  after_action :track_page_view, only: %i[all_products view_product]

  def all_products
    @products = product_details
  end

  def view_product
    @product = product_details[params["product_name"]]
  end

  # POST
  def purchase
    ActionController::Parameters.permit_all_parameters = true
    order_details = params["shop"]
    order_id = "ABC-123"

    # For this demo app, we demonstrate how to track a purchase by both the
    # custom self-describing JSON and out-of-the box eCommerce event types.
    custom_purchase_event(order_id, order_details)
    ecommerce_purchase_event(order_id, order_details)

    # redirect_to home_confirmation_path
  end

  private #------------------------------------------

  def custom_purchase_event(order_id, order_details)
    # The self-describing event type allows the grestest flexibility.
    # One event is sent per purchase, with product entities attached as context.
    # This Snowplow shop is interested in understanding the effects of sales/price reductions on revenue.
    # Therefore information about this is included for each product,
    # to enable easy modelling of the data.
    event_schema = "iglu:test.example.iglu/purchase_event/jsonschema/1-0-0"
    entity_schema = "iglu:test.example.iglu/product_entity/jsonschema/1-0-0"

    purchase_json = SnowplowTracker::SelfDescribingJson.new(
      event_schema, { "orderId" => order_id, "total" => order_details["total"] }
    )

    context = order_details["products"].map do |product|
      SnowplowTracker::SelfDescribingJson.new(entity_schema, product.to_h)
    end

    Snowplow.instance.tracker.track_self_describing_event(purchase_json, context)
  end

  def ecommerce_purchase_event(order_id, order_details)
    # Ruby tracker's built-in eCommerce event
    # is more complex than the Self-Describing event, especially for customisation.
    # A "transaction" event is sent, plus individual "transaction_item" events
    # for each unique product in the order.
    # To include information about e.g. price reductions, a custom context/entity
    # could be sent with each item.
    transaction = {
                    "order_id" => order_id,
                    "total_value" => order_details["total"]
                  }
    items = order_details["products"].map do |product|
      {
        "sku" => product["sku"],
        "price" => product["price"],
        "quantity" => product["quantity"],
        "name" => product["name"]
      }
    end
    Snowplow.instance.tracker.track_ecommerce_transaction(transaction, items)
  end

  # We chose not to use a database/CRUD layer for this demo app
  # to reduce complexity and the number of dependencies.
  # Product details are stored in a single file instead
  def product_details
    import.each_value { |info| info["display_price"] = display_price(info) }
  end

  def import
    path = File.join(Rails.root, "app", "lib", "products.yaml")
    YAML.safe_load(File.read(path))
  end

  def display_price(product)
    price = add_trailing_zero(product["price"].to_s)
    original_price = add_trailing_zero(product["original_price"].to_s)

    sale_string = "<strike>£#{original_price}</strike> £#{price}"
    price == original_price ? "£#{price}" : sale_string
  end

  def add_trailing_zero(price)
    price.split(".")[1].length == 1 ? (price << "0") : price
  end
end
