const express = require("express");
const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", cartController.getCart);

router.post("/item", cartController.addToCart);

router.patch("/item", cartController.updateCartItem);

module.exports = router;
