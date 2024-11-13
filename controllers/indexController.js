const db = require("../db/queries");

async function getProducts(req, res) {
  //   console.log("Controller getProducts");
  const rows = await db.getProducts();
  //   console.log("Controller getProducts: ", rows);
  res.render("index", { title: "Inventory Application", products: rows });
}

async function getNew(req, res) {
  console.log("Controller getNew");
  const rows = await db.getCategories();
  res.render("new", { title: "Create New Product", categories: rows });
}

async function postNew(req, res) {
  console.log("Controller post new");
  await db.postNewProduct(req, res);
  console.log("Controller post new 2");
  await db.postNewCategories(req, res);
  res.redirect("/");
}

module.exports = {
  getProducts,
  getNew,
  postNew,
};
