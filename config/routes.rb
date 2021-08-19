Rails.application.routes.draw do
  root to: "home#index"

  get "home/index"
  get "home/about"
  get "home/confirmation"

  get "shop/all_products"
  get "shop/:product_name", to: "shop#view_product", as: "product"

  post "purchase", to: "shop#purchase"
end
