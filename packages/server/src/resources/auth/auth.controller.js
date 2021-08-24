const {
  newToken, encryptPassword, checkPassword
} = require("../../utils/auth");
const pool = require("../../utils/db").pool;
const { signup } = require("./auth.validation")



//Checks a email and password taking in a JSON in the model:
/*{
  "email":"lucas1losekann@gmail.com",
  "password":"123456",
  }
  Returning a JWT
  */
exports.signin = async (req, res) => {
  //Checks if frontend sent all the required data
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Email and password needed",
      code: 11,
    });
  }
  const invalid = {
    message: "Email or password is invalid",
    code: 12,
  };

  try {
    //Checks if the user exists
    const user = await pool
      .promise()
      .query(`SELECT email,password,id FROM users WHERE email = ?`, [
        req.body.email,
      ]);
    if (!user) {
      return res.status(401).send(invalid);
    }
    //Checks if the sent password and the database password match 
    const match = await checkPassword(req.body.password, user[0][0].password);
    if (!match) {
      return res.status(401).send(invalid);
    }

    //If the user exists and the password matches send a JWT token to the client

    const token = newToken(user[0][0].id);
    return res.status(201).send({
      token,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: "Internal server error",
      code: 51,
    });
  }
};



//Creates a new user taking in a JSON in the model:
/*{
  "email":"lucas1losekann@gmail.com",
  "password":"123456",
  "firstName": "Lucas",
  "lastName": "Losekann Rosa",
  "phoneNumber": "48999416983",
  "gender": "Masculino",
  "address":{
    "street": "Rua Vilson Manoel Valerim",
    "number": "609",
    "postalCode": "88955000",
    "uf": "Santa Catarina",
    "country": "Brazil",
    "city": "Balneário Gaivota"
  }
}
  Returning a JWT
*/
exports.signup = async (req, res) => {
  
  let data;
  //Check if user exists with that email or phone number
  try {
    //Check if frontend sent all the necessary data
    data = await signup.validateAsync(req.body)
    let dbReponse = await pool
      .promise()
      .query("SELECT * FROM users WHERE email = ?; SELECT * FROM users WHERE phone_number = ?", [data.email, data.phoneNumber]);
    let [email, phone] = dbReponse[0];
    if (email.length > 0) {
      return res.status(400).send({
        message: `User already exists with that email`,
        code: 16,
      });
    }
    if (phone.length > 0) {
      return res.status(400).send({
        message: `User already exists with that phone number`,
        code: 17,
      });
    }
  } catch (e) {
    if(e.isJoi) return res.status(400).send({message: e.details[0].message, code: 61})
    return res.status(500).send({message: "Internal server error", code: 51})
  }

  //Creates a constant named number with the given number if it exists and if it doesn't assign null to it
  const number = data.address.number || null;

  const address = data.address;
  try {
    //Creates a hash of the password using bcrypt
    const passwordHash = await encryptPassword(data.password);

    //Begin a transaction in the format of a promise
    let user = await new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) return reject(err);
        connection.beginTransaction(function (err) {
          if (err) {
            //Transaction Error (Rollback and release connection)
            connection.rollback(function () {
              connection.release();
              reject(err);
            });
          } else {
            connection.query(
              "INSERT INTO addresses(street,postal_code, uf, city, country, number) VALUES (?,?,?,?,?,?)",
              [
                address.street,
                address.postalCode,
                address.uf,
                address.city,
                address.country,
                number,
              ],
              function (err, addressResults) {
                if (err) {
                  //Transaction Error (Rollback and release connection)
                  connection.rollback(function () {
                    connection.release();
                    reject(err);
                  });
                } else {
                  connection.query(
                    `INSERT INTO users(email, password, first_name, last_name, phone_number, address_id, gender, role_id)
                                        VALUES(?,?,?,?,?,?,?,(SELECT id FROM roles WHERE name='user'))`,
                    [
                      data.email,
                      passwordHash,
                      data.firstName,
                      data.lastName,
                      data.phoneNumber,
                      addressResults.insertId,
                      data.gender,
                    ],
                    function (err, results) {
                      if (err) {
                        //Transaction Error (Rollback and release connection)
                        connection.rollback(function () {
                          connection.release();
                          reject(err);
                        });
                      } else {
                        connection.commit(function (err) {
                          if (err) {
                            //Transaction Error (Rollback and release connection)
                            connection.rollback(function () {
                              connection.release();
                              reject(err);
                            });
                          } else {
                            //Transaction Succes (Release connection and retrieve data)
                            connection.release();
                            resolve(results);
                          }
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      });
    });
    //Creates a JWT token and send it to the server.
    const token = newToken(user.insertId);
    return res.status(201).send({
      token,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: "Internal server error",
      code: 51,
    });
  }
};