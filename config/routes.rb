Rails.application.routes.draw do
  root to: "home#index"

  get "home/index"
  get "home/about"

  get "shop/all_products"
  get "shop/blue_skis"
  get "shop/green_skis"
  get "shop/brown_skis"
  get "shop/white_poles"
  get "shop/confirmation"

  post "track_page_view", to: "application#track_page_view"

  post "track_screen_view", to: "home#track_screen_view"
  post "track_ecommerce", to: "home#track_ecommerce"
  post "track_struct", to: "home#track_struct"
  post "track_self_describing", to: "home#track_self_describing"

  post "add_to_basket", to: "shop#add_to_basket"
end
