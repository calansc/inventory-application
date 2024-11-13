const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/new", (req, res) => {
  //   console.log("Router new get...");
  indexController.getNew(req, res);
});

indexRouter.post("/new", (req, res) => {
  console.log("Router new post...");
  indexController.postNew(req, res);
});

indexRouter.get("/", (req, res) => {
  //   console.log("Index Router Get...");
  indexController.getProducts(req, res);
});

module.exports = indexRouter;
