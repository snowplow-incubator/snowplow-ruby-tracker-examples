console.log("in Shop.js");

document.addEventListener("turbolinks:load", function () {
  updateTotal(0);
  updateCount(0);
  updateContents();

  const addToBasketButtons = document.querySelectorAll(".basket-add");

  addToBasketButtons.forEach((element) => {
    element.addEventListener("click", () => {
      console.log("click!");

      const price = parseFloat(
        element.attributes.getNamedItem("data-price").nodeValue
      );
      const name = element.form.elements.name.value;
      const sku = element.form.elements.sku.value;
      const onSale = element.form.elements.on_sale.value;
      const originalPrice = element.form.elements.original_price.value;

      updateTotal(price);
      updateCount(1);
      updateContents(name);
      basketEntities.push(productEntityData(name, sku, onSale, originalPrice));
      console.log(basketEntities);

      // Tracking a product being added to the basket
      window.snowplow("trackSelfDescribingEvent", {
        event: {
          schema: "iglu:test.example.iglu/basket_action_event/jsonschema/1-0-0",
          data: {
            action: "add",
          },
        },
        // The specific product is included as an Entity in the Event context
        context: [
          {
            schema: "iglu:test.example.iglu/product_entity/jsonschema/1-0-0",
            data: {
              sku: sku,
              name: name,
              price: parseFloat(price),
              onSale: onSale === "true",
              startPrice: parseFloat(originalPrice),
              quantity: 1,
            },
          },
        ],
      });
    });
  });

  const purchaseForm = document.getElementById("purchase-form");
  purchaseForm.addEventListener("click", () => {
    console.log("clicked on purchase form");
    const purchaseDetails = document.getElementById("details");
    purchaseDetails.setAttribute("value", basketEntities);
  });
});

let basketTotal = 0;
let basketCount = 0;
let basketContentsHTML = "";
let basketEntities = [];

function updateTotal(price) {
  basketTotal += price;
  const total = document.getElementById("order-total");
  total.innerHTML = basketTotal;
}

function updateCount(num) {
  basketCount += num;
  const amount = document.getElementById("order-count");
  amount.innerHTML = basketCount;

  if (basketCount === 1) {
    const purchaseSubmit = document.getElementById("purchase-submit");
    purchaseSubmit.removeAttribute("disabled");
  }
}

function updateContents(name) {
  if (name !== undefined) basketContentsHTML += `<li>${name}</li>`;

  const items = document.getElementById("basket-items");
  items.innerHTML = basketContentsHTML;
}

function productEntityData(sku, name, price, onSale, originalPrice) {
  return {
    sku: sku,
    name: name,
    price: parseFloat(price),
    onSale: onSale === "true",
    startPrice: parseFloat(originalPrice),
    quantity: 1,
  };
}
