const db = require("../db/queries");

async function getProductsGroup(req, res) {
  //   console.log("Controller getProducts");
  const rows = await db.getProductsGroup();
  //   console.log("Controller getProducts: ", rows);
  res.render("index", { title: "Inventory Application", products: rows });
}

async function getNew(req, res) {
  console.log("Controller getNew");
  const rows = await db.getCategories();
  res.render("new", { title: "Create New Product", categories: rows });
}

async function postNew(req, res) {
  const existCheck = await db.getProductId(req);
  if (existCheck) {
    console.log("exists!");
  } else {
    console.log("Controller post new");
    await db.postNewProduct(req, res);
    console.log("Controller post new 2");
    await db.postNewProductCategories(req, res);
    res.redirect("/");
  }
}

async function getCategories(req, res) {
  const rows = await db.getCategories();
  res.render("categories", { title: "Categories", categories: rows });
}

async function getCategoryNew(req, res) {
  const rows = await db.getProducts();
  //   console.log("getCategoryNew products: ", rows);
  res.render("newCategory", { title: "Create New Category", products: rows });
}

async function postCategoryNew(req, res) {
  console.log("postCategoryNew controller: ", req.body.category);
  const existCheck = await db.getCategoryId(req);
  if (existCheck) {
    console.log("exists!");
  } else {
    console.log("postCategory new-1");
    await db.postNewCategory(req, res);
    console.log("postCategory new-2]");
    await db.postNewCategoryProducts(req, res);
    res.redirect("/categories");
  }
}

module.exports = {
  getProductsGroup,
  getNew,
  postNew,
  getCategories,
  getCategoryNew,
  postCategoryNew,
};
