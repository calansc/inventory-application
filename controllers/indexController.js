const db = require("../db/queries");

async function getProductsGroup(req, res) {
  // console.log("Index params: ", req.query.order);
  const rows = await db.getProductsGroup(req);
  //   console.log("Controller getProducts: ", rows);
  res.render("index", {
    title: "Inventory Application",
    products: rows,
  });
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

async function getCategoryById(req, res) {
  const rows = await db.queryCategoryById(req, res);
  // console.log("getCategoryById controller: ", rows);
  const products = await db.getProducts();
  // console.log("getCategoryById controller products: ", products);
  res.render("category", {
    title: "Edit Category",
    category: rows[0],
    products: products,
  });
}

async function postCategoryUpdateById(req, res) {
  await db.updateCategoryById(req, res);
  res.redirect("/categories");
}

async function getProductById(req, res) {
  const rows = await db.queryProductById(req);
  const categories = await db.getCategories();
  res.render("product.ejs", {
    title: "Edit Product",
    product: rows[0],
    categories: categories,
  });
}

async function postProductUpdateById(req, res) {
  console.log("postProductUpdateById controller: ", req.body);
  await db.updateProductById(req, res);
  res.redirect("/");
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
    // console.log("postCategory new-1");
    await db.postNewCategory(req, res);
    // console.log("postCategory new-2]");
    await db.postNewCategoryProducts(req, res);
    res.redirect("/categories");
  }
}

async function postDeleteProduct(req, res) {
  await db.deleteProduct(req, res);
  res.redirect("/");
}

module.exports = {
  getProductsGroup,
  getNew,
  postNew,
  getCategories,
  getCategoryById,
  postCategoryUpdateById,
  getProductById,
  postProductUpdateById,
  getCategoryNew,
  postCategoryNew,
  postDeleteProduct,
};
