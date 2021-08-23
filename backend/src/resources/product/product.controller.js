const { pool } = require("../../utils/db");


//Define the valid options in the getMany query
const validOrders = ['asc','desc'];
const validOrderBys = ['product', 'price', 'discount', 'popularity']
const validFilters = ['gender', 'b.name', 'c.color', 'lens' ]

// /api/product/
exports.getMany = async (req,res) => {

  //Define the query variables
  let order_by = req.query.orderBy || 'popularity';
  let order = req.query.order || 'desc';
  let query = req.query.query || '';
  let filters = req.query.filters || [];
  let limit = 20;
  let offset = req.query.page ? (req.query.page * limit)-limit : 0;

  //Checks if client sent filters query in an array format
  if(!Array.isArray(filters)) {
    return res.status(400).send({message: 'Filters must be an array', code:32})
  }

  //Separate the filters model into an array
  filters = filters.map(v=>v.split(';;;'))
  //Checks if the filter came in the correct formatting and if it actually exists as a valid column
  let validFilter = filters.every((e)=>validFilters.includes(e[0]))

  //Check the the query parameters are valid
  if(!validOrders.includes(order) || !validOrderBys.includes(order_by) || !validFilter){
    return res.status(400).send({message: 'Invalid order or filter', code:31})
  }

  //Checks if the client sent filters and then query the products and assign it to a variable
  let products;
  try{
    if(filters.length > 0){
      let filtersStr = filters.reduce((acc, cur) => `${acc} AND ${cur[0]} = ?`,'')
      let filtersFill = filters.map((v)=>v[1])
      products = await pool.promise().query(`
      SELECT gender,COUNT(o.product_id) as popularity, lens, p.id AS pId, p.name AS product,c.color AS p_color, b.name
      FROM products AS p
      INNER JOIN product_brands AS b ON b.id = p.brand 
      INNER JOIN product_colors AS c ON c.id = p.color
      LEFT JOIN orders AS o ON o.product_id = p.id
      WHERE p.name LIKE ?${filtersStr}
      GROUP BY p.id
      ORDER BY ${order_by} ${order}
      LIMIT ${limit}
      OFFSET ${offset}
      `,[`%${query}%`, ...filtersFill])
    }else{
      products = await pool.promise().query(`SELECT COUNT(o.product_id) as popularity, lens,  p.id AS pId, p.name AS product, b.name AS brand, c.color AS color FROM products AS p
      INNER JOIN product_brands AS b ON b.id = p.brand 
      INNER JOIN product_colors AS c ON c.id = p.color
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
    console.log(e)
  }


}

exports.createOne = async (req,res) => {
  
}


// /api/product/:id
exports.getOne = async (req,res) => {
  
}
exports.updateOne = async (req,res) => {
  
}
exports.removeOne = async (req,res) => {
  
}
