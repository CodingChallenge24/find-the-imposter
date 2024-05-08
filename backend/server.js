const express = require("express");
const bodyParser = require("body-parser");
const { getResult } = require("./handlers");
const { hasDuplicate } = require("./validator");

const PORT = process.env.PORT || 3000;

//// MIDDLEWARES
const app = express().set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//// ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/ask", ({ body: { query, test } }, res) => {
  const result = getResult(query);
  if (test) res.render("index", { result: JSON.stringify(result) });
  else res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
