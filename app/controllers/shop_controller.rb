class ShopController < ApplicationController
  after_action :track_page_view, except: :add_to_basket

  def all_products
  end

  def blue_skis
  end

  def green_skis
  end

  def brown_skis
  end

  def white_poles
  end

  def confirmation
  end

  # POST
  def add_to_basket
  end
end
