const Order = require("../models/orders.model");
const User = require("../models/user.model");
const stripe = require("stripe")(
  "sk_test_51PdYbbETblsGBR2cm0vVXBRYzlDVx3JD6i0cmAYSjPhzB1FKnQruVC7PVTtTpSG5UFa4QjeOmg288yoQoi1hcyOC00steQoSX1"
);

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customers/orders/orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: "http://localhost:3000/orders/success",
    cancel_url: "http://localhost:3000/orders/fail",
  });

  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render("customers/orders/success");
}

function getFail(req, res) {
  res.render("customers/orders/fail");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFail: getFail,
};
