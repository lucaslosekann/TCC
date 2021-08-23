const mysql = require('mysql2');
const dbConfig = require('../config/db.config.js')
const pool  = mysql.createPool(dbConfig);
//Setup connection with database so we can use it later through the pool object


//Listen to databse events and log it if there is an error
pool.on('connection', function (connection) {
  connection.on('error', function (err) {
    console.error(new Date(), 'Database error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'Database closed', err);
  });
});

setupDatabase();
//Exports the pool object to the node enviroment
exports.pool = pool;

//Setup the database creating all the necessary tabls
async function setupDatabase (){
  try{
    await pool.promise().query(`
    CREATE TABLE IF NOT EXISTS product_brands(
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      description VARCHAR(100)
      )`
    )
    await pool.promise().query(`
    CREATE TABLE IF NOT EXISTS product_colors(
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      color VARCHAR(30) NOT NULL
      )`
    )
    await pool.promise().query(`
    CREATE TABLE IF NOT EXISTS roles(
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(30) NOT NULL
      )`
    )
    await pool.promise().query(`
      CREATE TABLE IF NOT EXISTS addresses(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        number VARCHAR(6),
        street VARCHAR(255) NOT NULL,
        postal_code VARCHAR(11) NOT NULL,
        city VARCHAR(255) NOT NULL,
        uf VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL
        )`
    )
    await pool.promise().query(`
      CREATE TABLE IF NOT EXISTS users(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(45) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        gender ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
        address_id INT UNSIGNED NOT NULL,
        role_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (address_id) REFERENCES addresses(id)
      )`
    )
    await pool.promise().query(`
      CREATE TABLE IF NOT EXISTS products(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        discount DECIMAL(3, 2) NOT NULL DEFAULT 00.00,
        inventory INT UNSIGNED NOT NULL DEFAULT 0,
        price FLOAT NOT NULL,
        description VARCHAR(255),
        gender ENUM('Masculino', 'Feminino', 'Unissex') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        added_by INT UNSIGNED NOT NULL,
        lens ENUM('Sol', 'Grau', 'Outro') NOT NULL,
        dimensions VARCHAR(20),
        color INT UNSIGNED NOT NULL,
        brand INT UNSIGNED NOT NULL,
        FOREIGN KEY (brand) REFERENCES product_brands(id),
        FOREIGN KEY (color) REFERENCES product_colors(id),
        FOREIGN KEY (added_by) REFERENCES users(id)
      )`
    )
    await pool.promise().query(`
    CREATE TABLE IF NOT EXISTS payment_methods(
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(255) NOT NULL
    )`
  )
    await pool.promise().query(`
      CREATE TABLE IF NOT EXISTS orders(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_method INT UNSIGNED NOT NULL,
        status VARCHAR(50) NOT NULL,
        order_by INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        correios_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (payment_method) REFERENCES payment_methods(id),
        FOREIGN KEY (order_by) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`
    )
    
    console.log('Database setup done!')
  }catch(e){
    console.log(e);
  }
}