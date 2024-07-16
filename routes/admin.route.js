const express = require("express");
const adminController = require("../controllers/admin.controller");
const imageMiddleware = require("../middleware/imaage-upload");

const router = express.Router();

router.get("/products", adminController.getProducts);

router.get("/products/new", adminController.getNewProducts);

router.post("/products", imageMiddleware, adminController.createProducts);

router.get("/products/:id", adminController.getUpdateProduct);

router.post("/products/:id", imageMiddleware, adminController.updateProduct);

router.delete("/products/:id", adminController.deleteProduct);

router.get("/orders", adminController.getOrders);

router.patch("/orders/:id", adminController.updateOrder);

module.exports = router;
