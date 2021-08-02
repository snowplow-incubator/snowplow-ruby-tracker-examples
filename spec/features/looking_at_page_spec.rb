require "rails_helper"

feature "navigating around the site", type: :feature do
  scenario "about and history pages" do
    visit "/"
    click_on "About"
    expect(page).to have_content "About"

    click_on "History"
    expect(page).to have_content "History"

    find(".navbar-title").click
    expect(current_path).to eq "/home/index"
  end
end
