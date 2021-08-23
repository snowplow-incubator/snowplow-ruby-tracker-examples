require "rails_helper"

RSpec.describe "Shops", type: :request do
  describe "GET /all_products" do
    it "returns http success" do
      get "/shop/all_products"
      expect(response).to have_http_status(:success)
    end
  end
end
