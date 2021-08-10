console.log("in Shop.js");

document.addEventListener("turbolinks:load", function () {
  updateTotal(0);
  updateCount();

  const addToBasketButtons = document.querySelectorAll(".basket-add");

  addToBasketButtons.forEach((element) => {
    element.addEventListener("click", () => {
      console.log("click!");

      const price = parseFloat(
        element.attributes.getNamedItem("data-price").nodeValue
      );
      const name = element.form.elements.name.value;
      const sku = element.form.elements.sku.value;
      const isOnSale = element.form.elements.on_sale.value;
      const originalPrice = element.form.elements.original_price.value;

      // console.log(name);
      // console.log(element.form.elements);

      updateTotal(price);
      updateCount();
      addItemToBasket(name);
    });
  });
});

let basketTotal = 0;
let basketCount = 0;

function updateTotal(price) {
  basketTotal += price;
  const total = document.getElementById("order-total");
  total.innerHTML = basketTotal;
}

function updateCount() {
  basketCount += 1;
  const amount = document.getElementById("order-count");
  amount.innerHTML = basketCount;
}

function addItemToBasket(name) {
  const basketContents = document.getElementById("basket-items");
  basketContents.insertAdjacentHTML("afterbegin", `<li>${name}</li>`);
}
