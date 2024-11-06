const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  console.log("Index Router Get...");
  res.render("index", { title: "Inventory Application" });
});

module.exports = indexRouter;
