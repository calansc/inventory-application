const pool = require("./pool");

async function getProductsGroup(req) {
  //   console.log("getProducts query");
  let order = "alphaAZ";
  if (req.query.order) {
    order = req.query.order;
  }
  // if (req.query.order === "id09") {
  //   order = "products.id";
  // }
  const { rows } = await pool.query(
    `
    SELECT products.id, product, quantity, price, description,
    string_agg(category, ', ') AS Categories 
    FROM products
    LEFT JOIN product_category
    ON products.id = product_category.product_id
    LEFT JOIN categories
    ON product_category.category_id = categories.id
    GROUP BY products.id, products.product, products.quantity, products.price, products.description
    ORDER BY 
      CASE WHEN $1 = 'alphaAZ' THEN products.product END ASC,
      CASE WHEN $1 = 'alphaZA' THEN products.product END DESC,
      CASE WHEN $1 = 'id09' THEN products.id END ASC,
      CASE WHEN $1 = 'id90' THEN products.id END DESC
    `,
    [order]
  );
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

async function getCategories(req) {
  //   console.log("getCategories query");
  let order = "id09";
  if (req.query.order) {
    order = req.query.order;
  }
  const { rows } = await pool.query(
    `
        SELECT * FROM categories
        ORDER BY
          CASE WHEN $1 = 'alphaAZ' THEN category END ASC,
          CASE WHEN $1 = 'alphaZA' THEN category END DESC,
          CASE WHEN $1 = 'id09' THEN id END ASC,
          CASE WHEN $1 = 'id90' THEN id END DESC
    `,
    [order]
  );
  // console.log("getCategories results: ", rows);
  return rows;
}

async function getProductsIdList() {
  const { rows } = await pool.query(`
    SELECT id FROM products`);
  return rows;
}

async function getCategoriesIdList() {
  const { rows } = await pool.query(`
    SELECT id FROM categories`);
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
  const categoryRows = await getCategories(req);
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
    array_agg(categories.id) AS categoryids FROM products
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

async function queryCategoryById(req, res) {
  console.log("queryCategoryById: ", req.params);
  const { rows } = await pool.query(
    `SELECT categories.id, category,
    array_agg(products.id) AS productids FROM categories
    LEFT JOIN product_category
    ON categories.id = product_category.category_id
    LEFT JOIN products
    ON product_category.product_id = products.id
    WHERE categories.id = ($1)
    GROUP BY categories.id, categories.category`,
    [req.params.categoryId]
  );
  // console.log(rows);
  return rows;
}

async function updateProductById(req, res) {
  // console.log("updateProductById query", req.body[1]);
  await pool.query(
    `UPDATE products
    SET product = ($1), quantity = ($2), price = ($3), description = ($4)
    WHERE id = ($5)`,
    [
      req.body["product"],
      req.body["quantity"],
      req.body["price"],
      req.body["description"],
      req.params["productId"],
    ]
  );
  await pool.query(
    `DELETE FROM product_category
    WHERE product_id = ($1)`,
    [req.params["productId"]]
  );
  let categoriesIdList = await getCategoriesIdList();
  for (let id of categoriesIdList) {
    if (req.body[id.id] === "on") {
      await pool.query(
        "INSERT INTO product_category (product_id, category_id) VALUES ($1, $2)",
        [req.params["productId"], id.id]
      );
    }
  }
  // let productsIdList = await getProductsIdList();
  // // console.log(productsIdList);
  // for (let id of productsIdList) {
  //   if (req.body[id.id] === "on") {
  //     await pool.query(
  //       `INSERT INTO product_category(product_id, category_id)
  //       VALUES ($1, $2)`,
  //       [id.id, req.params["categoryId"]]
  //     );
  //   }
  // }
}

async function updateCategoryById(req, res) {
  // console.log("updateCategoryById query", req.body, req.params);
  // console.log(req.body["category"]);
  // console.log(req.params["categoryId"]);
  await pool.query(
    `UPDATE categories
    SET category = ($1)
    WHERE id = ($2)`,
    [req.body["category"], req.params["categoryId"]]
  );
  await pool.query(
    `DELETE FROM product_category
    WHERE category_id = ($1)`,
    [req.params["categoryId"]]
  );
  let productsIdList = await getProductsIdList();
  // console.log(productsIdList);
  for (let id of productsIdList) {
    if (req.body[id.id] === "on") {
      await pool.query(
        `INSERT INTO product_category(product_id, category_id)
        VALUES ($1, $2)`,
        [id.id, req.params["categoryId"]]
      );
    }
  }
}

async function deleteProduct(req, res) {
  await pool.query(`DELETE FROM product_category WHERE product_id = ($1)`, [
    req.params["productId"],
  ]);
  await pool.query(`DELETE FROM products WHERE id = ($1)`, [
    req.params["productId"],
  ]);
}

module.exports = {
  getProductsGroup,
  getProducts,
  getCategories,
  getProductsIdList,
  getCategoriesIdList,
  postNewProduct,
  postNewCategory,
  postNewProductCategories,
  postNewCategoryProducts,
  getProductId,
  getCategoryId,
  queryProductById,
  queryCategoryById,
  updateProductById,
  updateCategoryById,
  deleteProduct,
};
