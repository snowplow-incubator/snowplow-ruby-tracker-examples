Rails.application.routes.draw do
  root to: "home#index"

  get "home/index"
  get "home/about"
  get "home/history"

  post "track_page_view", to: "home#track_page_view"
  post "track_screen_view", to: "home#track_screen_view"
  post "track_ecommerce", to: "home#track_ecommerce"
  post "track_struct", to: "home#track_struct"
  post "track_self_describing", to: "home#track_self_describing"
end
