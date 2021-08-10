console.log("in Shop.js");

document.addEventListener("turbolinks:load", function () {
  updateTotal();
  updateCount();

  const addToBasketButtons = document.querySelectorAll(".basket-add");

  addToBasketButtons.forEach((element) => {
    element.addEventListener("click", () => {
      console.log("click!");
      let itemPrice = parseFloat(element.attributes[1].nodeValue);
      basketTotal += itemPrice;
      basketCount += 1;
      updateTotal();
      updateCount();
    });
  });
});

let basketTotal = 0;
let basketCount = 0;

function updateTotal() {
  let total = document.getElementById("order-total");
  total.innerHTML = basketTotal;
}

function updateCount() {
  let amount = document.getElementById("order-count");
  amount.innerHTML = basketCount;
}

function updateItems() {}

function addItemToBasket(item) {}
