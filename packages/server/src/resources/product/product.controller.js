const { pool } = require("../../utils/db");
const { createOne, getMany, getOne } = require("./product.validation");


//Define the filters for the getMany query
const validFilters = ['gender', 'b.name', 'c.color', 'lens' ]



// /api/product/


exports.getMany = async (req,res) => {
  let response;
  try{
    //Validates the incoming data
    response = await getMany.validateAsync(req.query)
  }catch(e){
    if(e.isJoi) return res.status(400).send({message: e.details[0].message, code: 61})
    return res.status(500).send({message: "Internal server error", code: 51})
  }
  //Define the query variables
  const {orderBy : order_by , order, query, page } = response;
  let filters = response.filters || [];
  let limit = 20;
  let offset = (page * limit) - limit;


  //Checks if the filter came in the correct formatting and if it actually exists as a valid column
  let sepFilters = [];
  let validFilter = filters.every((e)=> {sepFilters.push(e.split(';;;'));return validFilters.includes(e.split(';;;')[0])})

  //Check the the query parameters are valid
  if(!validFilter) return res.status(400).send({message: 'Invalid order or filter', code:31})
  filters = sepFilters;

  //Checks if the client sent filters and then query the products and assign it to a variable
  try{
    let products;
    if(filters.length > 0){
      let filtersStr = filters.reduce((acc, cur) => `${acc} AND ${cur[0]} = ?`,'')
      let filtersFill = filters.map((v)=>v[1])
      products = await pool.promise().query(`
      SELECT p.id AS pId, p.name AS product, discount, price, gender, COUNT(o.product_id) as popularity, lens, c.color AS color, b.name as brand, i.id AS thumb  
      FROM products AS p
      INNER JOIN product_brands AS b ON b.id = p.brand 
      INNER JOIN product_colors AS c ON c.id = p.color
      LEFT JOIN product_images i on p.id = i.project_id and i.isThumb = 1
      LEFT JOIN orders AS o ON o.product_id = p.id
      WHERE p.name LIKE ?${filtersStr}
      GROUP BY p.id
      ORDER BY ${order_by} ${order}
      LIMIT ${limit}
      OFFSET ${offset}
      `,[`%${query}%`, ...filtersFill])
    }else{
      products = await pool.promise().query(`
      SELECT p.id AS pId, p.name AS product, discount, price, gender, COUNT(o.product_id) as popularity, lens, c.color AS color, b.name AS brand, i.id AS thumb
      FROM products AS p
      INNER JOIN product_brands AS b ON b.id = p.brand 
      INNER JOIN product_colors AS c ON c.id = p.color
      LEFT JOIN product_images i on p.id = i.project_id and i.isThumb = 1
      LEFT JOIN orders AS o ON o.product_id = p.id
      WHERE p.name LIKE ?
      GROUP BY p.id
      ORDER BY ${order_by} ${order}
      LIMIT ${limit}
      OFFSET ${offset}
      `,[`%${query}%`])
    }
    //Send the products to the client.
    res.send(products[0])
  }catch (e) {
    return res.status(500).send({message: "Internal server error", code: 51})
  }
}

exports.createOne = async (req,res) => {
  try{
    //Validates the incoming data
    const 
    {name, price, gender, lens, color,
    brand, dimensions, description, inventory} = await createOne.validateAsync(req.body)
    //Insert the product into the database
    productId = await pool.promise().query(`INSERT INTO products (name, price, gender, lens, color, brand, dimensions, description, inventory, added_by)
                                VALUES(?,?,?,?,?,?,?,?,?,?)`,
    [name, price, gender, lens, color, brand, dimensions, description, inventory, req.user.id])
    
    //Send the product id back to the client
    res.send({id: productId[0].insertId})
  }catch (e) {
    if(e.isJoi) return res.status(400).send({message: e.details[0].message, code: 61})
    return res.status(500).send({message: "Internal server error", code: 51})
  }
}




// /api/product/:id


exports.getOne = async (req,res) => {
  try{
    const { id } = await getOne.validateAsync(req.params)
    //Get the product and its respective images from the database
    const dbResponse = await pool.promise().query(
      `SELECT p.id AS pId, p.name AS product, discount, inventory, price, p.description, gender, lens, dimensions, c.color AS color, b.name as brand
      FROM products AS p
      INNER JOIN product_brands AS b ON b.id = p.brand
      INNER JOIN product_colors AS c ON c.id = p.color
      WHERE p.id = ?;
      SELECT id, isThumb from product_images WHERE project_id = ?`,[id,id])
    const [product, images] = dbResponse[0]

    //Send it to the client
    res.send({product: product[0],images})
  }catch (e) {
    if(e.isJoi) return res.status(400).send({message: e.details[0].message, code: 61})
    return res.status(500).send({message: "Internal server error", code: 51})
  }
}

exports.updateOne = async (req,res) => {
  
}
exports.removeOne = async (req,res) => {
  
}
