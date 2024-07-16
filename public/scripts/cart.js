const addToCartButtonElement = document.querySelector(
  "#product-details button"
);

const cartBadgeElements = document.querySelectorAll(".nav-items .badge");

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    response = await fetch("/cart/item", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Can't add it, sorry");
    return;
  }

  if (!response.ok) {
    alert("Can't add it, sorry");
    return;
  }

  const responseData = await response.json();

  const newTotalQuantity = responseData.totalCartItems;

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = newTotalQuantity;
  }
}

addToCartButtonElement.addEventListener("click", addToCart);
