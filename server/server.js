// Budget API

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:4200" }));

app.get("/budget", (req, res) => {
  const budget = require("./budget.json");
  res.json(budget);
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
