//Connection configuration for the database
module.exports = {
  host     : 'localhost',
  user     : 'root',
  password : process.env.DB_PASS,
  database : 'db_testes',
  multipleStatements: true
}