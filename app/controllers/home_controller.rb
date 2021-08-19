class HomeController < ApplicationController
  after_action :track_page_view, only: %i[index about confirmation]

  def index
  end

  def about
  end

  def confirmation
  end
end
