const Product = require("../models/product.model");

async function getAllProduct(req, res, next) {
  let products;
  try {
    products = await Product.findAll();
    res.render("customers/products/products", { products: products });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    res.render("customers/products/product-details", { product: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProduct: getAllProduct,
  getProductDetails: getProductDetails,
};
