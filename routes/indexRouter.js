const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.post("/product/delete/:productId", (req, res) => {
  indexController.postDeleteProduct(req, res);
});

indexRouter.get("/product/:productId", (req, res) => {
  indexController.getProductById(req, res);
});

indexRouter.post("/product/:productId", (req, res) => {
  indexController.postProductUpdateById(req, res);
});

indexRouter.get("/new", (req, res) => {
  indexController.getNew(req, res);
});

indexRouter.post("/new", (req, res) => {
  indexController.postNew(req, res);
});

indexRouter.get("/categories/new", (req, res) => {
  indexController.getCategoryNew(req, res);
});

indexRouter.post("/categories/new", (req, res) => {
  indexController.postCategoryNew(req, res);
});

indexRouter.get("/categories/:categoryId", (req, res) => {
  indexController.getCategoryById(req, res);
});

indexRouter.post("/categories/:categoryId", (req, res) => {
  indexController.postCategoryUpdateById(req, res);
});

indexRouter.get("/categories", (req, res) => {
  indexController.getCategories(req, res);
});

indexRouter.get("/", (req, res) => {
  indexController.getProductsGroup(req, res);
});

module.exports = indexRouter;
