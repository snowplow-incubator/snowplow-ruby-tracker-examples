console.log("in Shop.js");

let basketTotal = 0;

function addItemToBasket(item) {}

document.addEventListener("turbolinks:load", function () {
  const addToBasketButtons = document.querySelectorAll(".basket-add");

  addToBasketButtons.forEach((element) => {
    element.addEventListener("click", () => {
      console.log("click!");
      let itemPrice = parseFloat(element.attributes[1].nodeValue);
      basketTotal += itemPrice;
      console.log(basketTotal);
    });
  });
});
