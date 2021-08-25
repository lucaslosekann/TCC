const { pool } = require("../../utils/db")
const { multiImageUpload } = require("../../utils/multer")
const { getFileStream, uploadFile } = require("../../utils/s3")
const { getById } = require("./image.validation");

const { unlink } = require('fs');
const unLink = require('util').promisify(unlink)


//Get a image from the given id 
exports.getById = async (req,res) => {
  const id = req.params.id
  try{
    const { id } = await getById.validateAsync(req.params)
    let image = await pool.promise().query(`SELECT aws_name FROM product_images WHERE id = ?`, [id])
    if(image[0].length <= 0)return res.status(400).send({message:"Must provide an valid id", code: 41})
    const stream = getFileStream(image[0][0].aws_name)
    stream.pipe(res)
  }catch(e){
    if(e.isJoi) return res.status(400).send({message: e.details[0].message, code: 61})
    return res.status(500).send({message: "Internal server error", code: 51})
  }
}

//Upload one or more non-thumb images correspondent to a project id using amazon S3
exports.uploadMany = async (req,res) => {
  multiImageUpload(req, res, async (err) => {
    if(err){
      return res.send({message:err.message, code:err.name})
    }
    const { project_id } = req.body;
    try{
      //Uses S3 to upload the files
      await Promise.all(req.files.map(uploadFile));

      //Delete the files from the uploads folder and then insert them into the database
      const response = await Promise.all(
        [ ...req.files.map(file => unLink(file.path)),
          ...req.files.map(({size, mimetype, ...file}) => 
            pool.promise().query(`INSERT INTO product_images(aws_name, size, mimetype, project_id, isThumb) VALUES(?,?,?,?,?)`,
              [file.filename, size, mimetype, project_id, false])
          )
        ]);
      
      //Organize the image data in a array named files and then send it to the client
      const files = req.files.map(({size, mimetype, ...file},idx) => {return {awsName: file.filename, size, mimetype, id: response[req.files.length + idx][0].insertId}})             
      res.send(files)
    }catch(e){
      res.send({message:"Internal server error", code: 51})
    }
  })
}