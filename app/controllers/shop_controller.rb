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
    p "in purchase 💸"
    order_id = "ABC-123"

    # tracking goes here

    redirect_to home_confirmation_path
  end

  private #------------------------------------------

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
