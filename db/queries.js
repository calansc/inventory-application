const pool = require("./pool");

async function getProductsGroup() {
  //   console.log("getProducts query");
  const { rows } = await pool.query(`
    SELECT products.id, product, quantity, price, description,
    string_agg(category, ', ') AS Categories 
    FROM products
    LEFT JOIN product_category
    ON products.id = product_category.product_id
    LEFT JOIN categories
    ON product_category.category_id = categories.id
    GROUP BY products.id, products.product, products.quantity, products.price, products.description
    ORDER BY products.product
    `);
  // add in sort by feature on home page with ORDER BY
  //   console.log("getProducts query results: ", rows);
  return rows;
}

async function getProducts() {
  const { rows } = await pool.query(`
          SELECT * FROM products;
      `);
  //   console.log("getProducts results: ", rows);
  return rows;
}

async function getCategories() {
  //   console.log("getCategories query");
  const { rows } = await pool.query(`
        SELECT * FROM categories;
    `);
  console.log("getCategories results: ", rows);
  return rows;
}

async function postNewProduct(req, res) {
  console.log("postNewProduct: ", req.body);
  await pool.query(
    "INSERT INTO products (product, quantity, price, description) VALUES ($1, $2, $3, $4)",
    [req.body.product, req.body.quantity, req.body.price, req.body.description]
  );
}

async function postNewCategory(req, res) {
  console.log("postNewCategory: ", req.body);
  await pool.query("INSERT INTO categories (category) VALUES ($1)", [
    req.body.category,
  ]);
}

async function postNewProductCategories(req, res) {
  //   console.log("Full req body... : ", req.body);
  const id = await getProductId(req, res);
  const categoryRows = await getCategories();
  for (const category of categoryRows) {
    let categoryName = category.category;
    // console.log("CategoryName: ", categoryName);
    // console.log("Request categoryName: ", req.body[categoryName]);
    if (req.body[categoryName] === "on") {
      //   console.log("if on start...");
      let categoryId = await getCategoryIdByName(categoryName);
      //   console.log("categoryId: ", categoryId);
      await pool.query(
        "INSERT INTO product_category (product_id, category_id) VALUES ($1, $2)",
        [id, categoryId]
      );
    }
  }
}

async function postNewCategoryProducts(req, res) {
  console.log("Full req body... : ", req.body);
  const id = await getCategoryId(req, res);
  const productRows = await getProducts();
  for (const product of productRows) {
    let productName = product.product;
    // console.log("CategoryName: ", categoryName);
    console.log("Request productName: ", req.body[productName]);
    if (req.body[productName] === "on") {
      console.log("if on start...");
      let productId = await getProductIdByName(productName);
      console.log("productId: ", productId);
      await pool.query(
        "INSERT INTO product_category (product_id, category_id) VALUES ($1, $2)",
        [productId, id]
      );
    }
  }
}

async function getProductId(req, res) {
  console.log("getProductId of product name: ", req.body.product);
  const { rows } = await pool.query(
    "SELECT MIN(id) FROM products WHERE product = ($1)",
    [req.body.product]
  );
  console.log("getProductId result: ", rows);
  return rows[0].min;
}
async function getProductIdByName(product) {
  const { rows } = await pool.query(
    "SELECT MIN(id) FROM products WHERE product = ($1)",
    [product]
  );
  return rows[0].min;
}
async function getCategoryId(req, res) {
  console.log("getCategoryId of category name: ", req.body.category);
  const { rows } = await pool.query(
    "SELECT MIN(id) FROM categories WHERE category = ($1)",
    [req.body.category]
  );
  console.log("getCategoryId result: ", rows);
  return rows[0].min;
}
async function getCategoryIdByName(category) {
  const { rows } = await pool.query(
    "SELECT MIN(id) FROM categories WHERE category = ($1)",
    [category]
  );
  return rows[0].min;
}

async function getCategoryCount() {
  console.log("getCategoryCount...");
  const { rows } = await pool.query("SELECT COUNT(*) FROM categories");
  console.log("CategoryCount: ", rows[0].count);
  let categoryCount = rows[0].count;
  return categoryCount;
}

async function queryProductById(req) {
  const { rows } = await pool.query(
    `SELECT products.id, product, quantity, price, description,
    string_agg(categories.id::text, ', ') AS categoryids FROM products
    LEFT JOIN product_category
    ON products.id = product_category.product_id
    LEFT JOIN categories
    ON product_category.category_id = categories.id
    WHERE products.id = ($1)
    GROUP BY products.id, products.product, products.quantity, products.price, products.description`,
    [req.params.productId]
  );
  console.log(rows);
  return rows;
}

async function queryCategoryById() {}

module.exports = {
  getProductsGroup,
  getProducts,
  getCategories,
  postNewProduct,
  postNewCategory,
  postNewProductCategories,
  postNewCategoryProducts,
  getProductId,
  getCategoryId,
  queryProductById,
  queryCategoryById,
};
