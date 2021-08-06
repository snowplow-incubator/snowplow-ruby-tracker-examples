class ShopController < ApplicationController
  after_action :track_page_view, except: :add_to_basket

  # To avoid complexity and dependencies in this demo app, we chose not to use a database/CRUD layer
  PRODUCT_DETAILS = {
                      blue_skis: { title: "Blue skis (size M)",
                                   description: "Attractive blue medium-weight skis, size M (167cm). Very stable and ideal for beginners. Suitable for all mountain conditions.",
                                   price: "£300.00" },
                      green_skis: { title: "Green skis (size S)",
                                    description: "Flexible, lightweight green skis, size S (147cm). Perfect for the piste.",
                                    price: "£449.99" },
                      brown_skis: { title: "White and brown skis (size M) [SALE]",
                                    description: "We need to make space in our warehouse, so don't miss these last season all-terrain brown and white skis, size M (165cm), now reduced in price! A fantastic set of skis with perfect sidecut shape.",
                                    price: "<strike>£235.00</strike> £184.00" },
                      white_poles: { title: "Ski poles (white)",
                                     description: "All-rounder white ski poles. Great for beginners.",
                                     price: "£59.80" }
                    }

  def all_products
    @products = PRODUCT_DETAILS
  end

  def blue_skis
    @product = PRODUCT_DETAILS[:blue_skis]
  end

  def green_skis
    @product = PRODUCT_DETAILS[:green_skis]
  end

  def brown_skis
    @product = PRODUCT_DETAILS[:brown_skis]
  end

  def white_poles
    @product = PRODUCT_DETAILS[:white_poles]
  end

  def confirmation
  end

  # POST
  def add_to_basket
  end
end
