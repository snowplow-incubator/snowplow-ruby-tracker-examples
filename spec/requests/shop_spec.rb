require 'rails_helper'

RSpec.describe "Shops", type: :request do
  describe "GET /all_products" do
    it "returns http success" do
      get "/shop/all_products"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /blue_skis" do
    it "returns http success" do
      get "/shop/blue_skis"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /green_skis" do
    it "returns http success" do
      get "/shop/green_skis"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /brown_skis" do
    it "returns http success" do
      get "/shop/brown_skis"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /white_poles" do
    it "returns http success" do
      get "/shop/white_poles"
      expect(response).to have_http_status(:success)
    end
  end

end
