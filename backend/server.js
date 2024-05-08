const express = require("express");
const bodyParser = require("body-parser");
const { hasDuplicate } = require("./validator.js");
const { n, k, imposIds } = require("./data.js");

const PORT = process.env.PORT || 3000;

//// Checker

function getNumImposters(arr) {
  return arr.reduce(
    (acc, value) => acc + (imposIds.includes(value) ? 1 : 0),
    0
  );
}

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

app.get("/ans", (req, res) => {
  res.json({ n, k, imposIds });
});

app.post("/ask", ({ body: { query } }, res) => {
  const ques = query.trim().split(" ");
  const resObj = {
    answer: "VALID",
    query,
  };
  if (ques[0] === "?") {
    if (ques.length !== 4) {
      resObj.answer = "INVALID";
      resObj.message = "Expected 3 numbers, but got " + (ques.length - 1);
    } else {
      const poss = ques.slice(1, 4).map((value) => parseInt(value));
      if (hasDuplicate(poss)) {
        resObj.answer = "INVALID";
        resObj.message = "Duplicate numbers are not allowed";
      } else {
        resObj.answer = poss;
        if (getNumImposters(poss) > 1) resObj.answer = "MORE";
        else resObj.answer = "LESS";
      }
    }
  } else if (ques[0] === "!") {
    if (ques.length > 1) {
      const out_k = parseInt(ques[1]);
      if (ques.length - 2 != k) {
        resObj.answer = "INVALID";
        resObj.message = `Expected ${k} numbers, but got ${ques.length - 2}`;
      } else {
        const poss = ques.slice(2, 2 + k).map((value) => parseInt(value));
        if (hasDuplicate(poss)) {
          resObj.answer = "INVALID";
          resObj.message = "Duplicate numbers are not allowed";
        } else {
          resObj.answer = poss.reduce(
            (acc, value) => acc + (imposIds.includes(value) ? 1 : 0),
            0
          );
        }
      }
    } else {
      resObj.answer = "INVALID";
      resObj.message = "Invalid query";
    }
  } else {
    resObj.answer = "INVALID";
    resObj.message = "Invalid query";
  }
  res.json(resObj);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
