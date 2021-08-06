Rails.application.routes.draw do
  root to: "home#index"

  get "home/index"
  get "home/about"
  get "home/confirmation"

  get "shop/all_products"
  get "shop/:product_name", to: "shop#view_product", as: "product"

  post "track_page_view", to: "application#track_page_view"
  post "track_screen_view", to: "home#track_screen_view"
  post "track_ecommerce", to: "home#track_ecommerce"
  post "track_struct", to: "home#track_struct"
  post "track_self_describing", to: "home#track_self_describing"

  post "purchase", to: "shop#purchase"
end
