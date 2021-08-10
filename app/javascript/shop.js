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

      updateTotal(price);
      updateCount();
      showNameInBasket(name);

      // Tracking the basket addition
      window.snowplow("trackSelfDescribingEvent", {
        event: {
          schema: "iglu:test.example.iglu/basket_action_event/jsonschema/1-0-0",
          data: {
            type: "add",
          },
        },
        context: [
          {
            schema: "iglu:test.example.iglu/product_entity/jsonschema/1-0-0",
            data: {
              sku: sku,
              name: name,
              price: parseFloat(price),
              onSale: isOnSale,
              startPrice: originalPrice,
            },
          },
        ],
      });
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

function showNameInBasket(name) {
  const basketContents = document.getElementById("basket-items");
  basketContents.insertAdjacentHTML("afterbegin", `<li>${name}</li>`);
}
