const express = require("express");
const path = require("path");
const session = require("express-session");
const csrf = require("csurf");

const sessionStoreConfig = require("./config/session");
const authRoutes = require("./routes/auth.route");
const baseRoute = require("./routes/base.route");
const productsRoute = require("./routes/products.route");
const adminRoute = require("./routes/admin.route");
const cartRoute = require("./routes/cart.route");
const ordersRoute = require("./routes/orders.route");
const db = require("./data/database");
const checkAuthMiddleware = require("./middleware/authenticate");
const notFoundMiddleware = require("./middleware/not-found");
const updateCartPricesMiddleware = require("./middleware/update-prices");
const protectRoutesMiddleware = require("./middleware/checkAdmin");
const csrfTokenMiddleware = require("./middleware/csrf-token");
const errorHanlderMiddleware = require("./middleware/error-handler");
const cartMiddleware = require("./middleware/cart");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = sessionStoreConfig();

app.use(session(sessionConfig));

app.use(checkAuthMiddleware);

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(csrf());

app.use(csrfTokenMiddleware);

app.use(authRoutes);
app.use(baseRoute);
app.use(productsRoute);
app.use("/cart", cartRoute);
app.use("/orders", protectRoutesMiddleware, ordersRoute);
app.use("/admin", protectRoutesMiddleware, adminRoute);

app.use(errorHanlderMiddleware);

app.use(notFoundMiddleware);

db.connecToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.alert("Faild to connect to the database");
    console.log(error);
  });
