const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

function getCart(req, res) {
  res.render("customers/cart/cart");
}

async function addToCart(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }
  const cart = res.locals.cart;
  cart.addItem(product);
  req.session.cart = cart;

  res.status(201).json({
    message: "Cart Updated",
    totalCartItems: cart.totalQuantity,
  });
}

function updateCartItem(req, res) {
  const cart = res.locals.cart;
  const updateItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity
  );

  req.session.cart = cart;

  res.json({
    message: "Item Updated",
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updateItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addToCart: addToCart,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
