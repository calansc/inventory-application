const pool = require("./pool");

async function getProducts() {
  //   console.log("getProducts query");
  const { rows } = await pool.query(`
    SELECT products.id, product, quantity, price, description,
    string_agg(category, ', ') AS Categories 
    FROM products
    INNER JOIN product_category
    ON products.id = product_category.product_id
    INNER JOIN categories
    ON product_category.category_id = categories.id
    GROUP BY products.id, products.product, products.quantity, products.price, products.description
    `);
  //   console.log("getProducts query results: ", rows);
  return rows;
}

async function getCategories() {
  //   console.log("getCategories query");
  const { rows } = await pool.query(`
        SELECT * FROM categories;
    `);
  //   console.log("getCategories results: ", rows);
  return rows;
}

async function postNewProduct(req, res) {
  console.log("postNewProduct: ", req.body);
  // Add if product exists, return an error
  await pool.query(
    "INSERT INTO products (product, quantity, price, description) VALUES ($1, $2, $3, $4)",
    [req.body.product, req.body.quantity, req.body.price, req.body.description]
  );
}
async function postNewCategories(req, res) {
  console.log("postNewCategory: ", req.body[1]);
  console.log("postNewCategory: ", req.body[2]);
  console.log("postNewCategory: ", req.body[3]);
  const id = await getProductId(req, res);
  console.log(id);
}

// Use a multiselect for the user to select categories
// when creating a new product. Can do the same for creating new
// categories. May need to loop through an array to insert multiple
// values??

async function getProductId(req, res) {
  console.log("getProductId of product name: ", req.body.product);
  const { rows } = await pool.query(
    "SELECT MIN(id) FROM products WHERE product = ($1)",
    [req.body.product]
  );
  console.log("getProductId result: ", rows);
  return rows[0].min;
}

module.exports = {
  getProducts,
  getCategories,
  postNewProduct,
  postNewCategories,
};
