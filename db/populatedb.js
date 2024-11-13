const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product VARCHAR ( 255 ) NOT NULL,
    description TEXT,
    quantity INTEGER,
    price NUMERIC
);
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category VARCHAR ( 255 ) NOT NULL
);
CREATE TABLE IF NOT EXISTS product_category (
    product_id INTEGER,
    category_id INTEGER,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO products (product, description, quantity, price)
VALUES ('Whole Milk', 'Pasteurized full fat milk from a cow', 10, 2.99);

INSERT INTO products (product, description, quantity, price)
VALUES ('Chicken Breast', 'Boneless, skinless chicken breast', 5, 9.99);

INSERT INTO categories (category)
VALUES ('dairy');

INSERT INTO categories (category)
VALUES ('refrigerated');

INSERT INTO product_category (product_id, category_id)
VALUES 
(1,1),
(1,2),
(2,2);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString:
      "postgresql://chad:asdf@localhost:5432/inventory_application",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
