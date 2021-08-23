let basketTotal = 0;
let basketCount = 0;
let basketContentsHTML = "";
let basketEntities = [];

document.addEventListener("turbolinks:load", function () {
  updateTotal(0);
  updateCount(0);
  updateContents();

  const addToBasketButtons = document.querySelectorAll(".basket-add");

  addToBasketButtons.forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      const product = JSON.parse(
        element.attributes.getNamedItem("data-product").value
      );

      updateTotal(product.price);
      updateCount(1);
      updateBasketEntities(product);
      updateContents();

      // Tracking a product being added to the basket.
      window.snowplow("trackSelfDescribingEvent", {
        event: {
          schema: "iglu:test.example.iglu/basket_action_event/jsonschema/1-0-0",
          data: {
            action: "add",
          },
        },
        // The specific product is included as an Entity in the Event context.
        context: [
          {
            schema: "iglu:test.example.iglu/product_entity/jsonschema/1-0-0",
            data: productEntityData(product),
          },
        ],
      });
    });
  });

  const purchaseForm = document.getElementById("purchase-form");
  purchaseForm.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("clicked on purchase form");

    const orderTotal = parseFloat(
      document.getElementById("order-total").textContent
    );
    const purchaseDetails = { total: orderTotal, products: basketEntities };
    const csrfToken = document.querySelector("[name='csrf-token']").content;

    // The purchase could be tracked here using the JS tracker
    // but it's generally more accurate to track purchases server-side.
    fetch("/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(purchaseDetails),
    }).then(() => {
      window.location.assign("/home/confirmation");
    });
  });
});

function updateTotal(price) {
  basketTotal += price;
  const total = document.getElementById("order-total");
  total.innerHTML = basketTotal.toFixed(2);
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

function updateBasketEntities(product) {
  const alreadyInBasket = basketEntities.find(
    (entity) => entity.sku === product.sku
  );
  if (alreadyInBasket === undefined) {
    basketEntities.push(productEntityData(product));
  } else {
    alreadyInBasket.quantity += 1;
  }
}

function updateContents() {
  const newContents = basketEntities.map((product) => {
    return `<p class="basket-item">${product.quantity}x ${product.name}</p>`;
  });
  const items = document.getElementById("basket-items");
  items.innerHTML = newContents.join("");
}

function productEntityData(product) {
  return {
    sku: product.sku,
    name: product.title,
    price: product.price,
    on_sale: product.sale,
    orig_price: product.original_price,
    quantity: 1,
  };
}
