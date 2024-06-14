import express from "express";
import bodyParser from "body-parser";
import path from "path";
import pg from "pg";
import { fileURLToPath } from "url";
import session from "express-session";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: " ",
  password: " ",
  port: 5432,
});

const app = express();
const port = 3000;

db.connect();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secretkey123",
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.get("/admin_home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin_home.html"));
});

app.get("/customer_home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "customer_home.html"));
});

app.get("/order_success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "order_success.html"));
});

app.get("/my_orders", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "my_orders.html"));
});

app.get("/customer_add", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "customer_add.html"));
});

app.get("/customer_delete", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "customer_delete.html"));
});

app.get("/product_add", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "product_add.html"));
});

app.get("/product_delete", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "product_delete.html"));
});

app.get("/order_add", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "order_add.html"));
});

app.get("/order_delete", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "order_delete.html"));
});

app.get("/seller_add", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "seller_add.html"));
});

app.get("/seller_delete", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "seller_delete.html"));
});

app.get("/reviews_add", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reviews_add.html"));
});

app.get("/reviews_delete", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reviews_delete.html"));
});

app.get("/signup-page", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup-page.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});

app.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;
  const query =
    "SELECT * FROM credentials_admin WHERE username = $1 AND password = $2";
  try {
    const result = await db.query(query, [username, password]);
    if (result.rows.length > 0) {
      res.redirect("/admin_home");
    } else {
      res
        .status(401)
        .send("Authentication failed: Invalid username or password.");
    }
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).send("Error during login process");
  }
});

app.post("/customer/add", async (req, res) => {
  const { customerid, customeruniqueid, zipcode, city, state } = req.body;
  const query =
    "INSERT INTO customer (customerid, customeruniqueid, zipcode, city, state) VALUES ($1, $2, $3, $4, $5)";
  try {
    const result = await db.query(query, [
      customerid,
      customeruniqueid,
      zipcode,
      city,
      state,
    ]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to add customer:", error);
    res.status(500).send("Error adding new customer");
  }
});

app.post("/customer/delete", async (req, res) => {
  const { customerid } = req.body;
  const query = "DELETE FROM customer WHERE customerid = $1;";
  try {
    const result = await db.query(query, [customerid]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).send("Error deleting customer");
  }
});

app.post("/order/add", async (req, res) => {
  const {
    orderid,
    customerid,
    orderstatus,
    orderpurchasetimestamp,
    orderapprovedat,
    orderdeliveredcustomerdate,
    orderestimateddeliverydate,
  } = req.body;
  const query = `
    INSERT INTO order_details (orderid, customerid, orderstatus, orderpurchasetimestamp, orderapprovedat, orderdeliveredcustomerdate, orderestimateddeliverydate)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;
  try {
    const result = await db.query(query, [
      orderid,
      customerid,
      orderstatus,
      orderpurchasetimestamp,
      orderapprovedat,
      orderdeliveredcustomerdate,
      orderestimateddeliverydate,
    ]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to add order:", error);
    res.status(500).send("Error adding new order");
  }
});

app.post("/order/delete", async (req, res) => {
  const { orderid } = req.body;
  const query = "DELETE FROM order_details WHERE orderid = $1;";
  try {
    const result = await db.query(query, [orderid]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).send("Error deleting order");
  }
});

app.post("/product/add", async (req, res) => {
  const {
    productid,
    productcategoryname,
    productweight,
    productlength,
    productheight,
    productwidth,
  } = req.body;
  const query = `
    INSERT INTO products (productid, productcategoryname, productweight, productlength, productheight, productwidth)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
  try {
    const result = await db.query(query, [
      productid,
      productcategoryname,
      productweight,
      productlength,
      productheight,
      productwidth,
    ]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).send("Error adding new product");
  }
});

app.post("/product/delete", async (req, res) => {
  const { productid } = req.body;
  const query = "DELETE FROM products WHERE productid = $1;";
  try {
    const result = await db.query(query, [productid]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).send("Error deleting product");
  }
});

app.post("/seller/add", async (req, res) => {
  const { sellerid, sellerzipcode, sellercity, sellerstate } = req.body;
  const query =
    "INSERT INTO sellers (sellerid, sellerzipcode, sellercity, sellerstate) VALUES ($1, $2, $3, $4)";
  try {
    const result = await db.query(query, [
      sellerid,
      sellerzipcode,
      sellercity,
      sellerstate,
    ]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to add seller:", error);
    res.status(500).send("Error adding new seller");
  }
});

app.post("/seller/delete", async (req, res) => {
  const { sellerid } = req.body;
  const query = "DELETE FROM sellers WHERE sellerid = $1";
  try {
    const result = await db.query(query, [sellerid]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to delete seller:", error);
    res.status(500).send("Error deleting seller");
  }
});

app.post("/review/add", async (req, res) => {
  const { reviewid, orderid, reviewscore } = req.body;
  const query =
    "INSERT INTO reviews (reviewid, orderid, reviewscore) VALUES ($1, $2, $3)";
  try {
    const result = await db.query(query, [reviewid, orderid, reviewscore]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to add review:", error);
    res.status(500).send("Error adding new review");
  }
});

app.post("/review/delete", async (req, res) => {
  const { reviewid } = req.body;
  const query = "DELETE FROM reviews WHERE reviewid = $1";
  try {
    const result = await db.query(query, [reviewid]);
    res.redirect("/admin_home");
  } catch (error) {
    console.error("Failed to delete review:", error);
    res.status(500).send("Error deleting review");
  }
});

app.post("/authenticate/customer", async (req, res) => {
  const { unique_id, password } = req.body;
  const query =
    "SELECT * FROM credentials WHERE unique_id = $1 AND password = $2";
  try {
    const result = await db.query(query, [unique_id, password]);
    if (result.rows.length > 0) {
      req.session.unique_id = unique_id;
      res.redirect("/customer_home");
    } else {
      res
        .status(401)
        .send("Authentication failed: Invalid unique id or password.");
    }
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).send("Error during login process");
  }
});

app.get("/get/products", async (req, res) => {
  try {
    const query = `
    SELECT 
    p.productid, 
    p.productcategoryname, 
    p.productweight,
    p.productlength,
    p.productheight,
    p.productwidth,
    t.productcategorynameenglish,
    o.price
    FROM products p
    JOIN product_category_translation t ON p.productcategoryname = t.productcategoryname
    JOIN orders o ON o.productid = p.productid
    LIMIT 500;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error retrieving products");
  }
});

app.get("/order/view/customer", async (req, res) => {
  if (!req.session.unique_id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const uniqueId = req.session.unique_id;
  try {
    const result = await db.query(
      "SELECT orderid, o.customerid, orderstatus FROM order_details o JOIN customer c ON o.customerid=c.customerid WHERE customeruniqueid=$1",
      [uniqueId]
    );
    console.log("Query Result:", result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders data:", error);
    res.status(500).send("Error retrieving orders data");
  }
});

app.post("/signup-form", async (req, res) => {
  const { unique_id, password } = req.body;
  try {
    const query =
      "INSERT INTO credentials (unique_id, password) VALUES ($1, $2)";
    const result = await db.query(query, [unique_id, password]);
    res.redirect("/login_customer.html");
  } catch (error) {
    console.error("Error inserting data into database:", error);
    res.status(500).send("Failed to sign up");
  }
});

app.post("/submit-query", async (req, res) => {
  const { sqlQuery } = req.body;
  try {
    const queryResult = await db.query(sqlQuery);
    req.session.queryResults = queryResult.rows;
    res.redirect("/query_results.html");
  } catch (error) {
    console.error("Failed to execute query:", error);
    res.status(500).send("Failed to execute query");
  }
});

app.get("/get-query-results", (req, res) => {
  if (req.session.queryResults) {
    res.json(req.session.queryResults);
  } else {
    res.status(404).send("No query results area avilable");
  }
});
