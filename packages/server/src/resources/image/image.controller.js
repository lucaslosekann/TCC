const { pool } = require("../../utils/db")
const { multiImageUpload } = require("../../utils/multer")
const { getFileStream, uploadFile } = require("../../utils/s3")
const util = require('util');
const fs = require('fs');
const unLink = util.promisify(fs.unlink)


exports.getById = async (req,res) => {
  const id = req.params.id
  if(!id)return res.status(400).send({message:"Must provide an valid id", code: 41})
  let image = await pool.promise().query(`SELECT aws_name FROM product_images WHERE id = ?`, [id])
  if(image[0].length <= 0)return res.status(400).send({message:"Must provide an valid id", code: 41})
  const stream = getFileStream(image[0][0].aws_name)
  stream.pipe(res)
}

exports.uploadMany = async (req,res) => {
  
  multiImageUpload(req, res, async (err) => {
    if(err){
      return res.send({message:err.message, code:err.name})
    }
    const {project_id} = req.body;
    try{
      const uploads = req.files.map(uploadFile)
      await Promise.all(uploads);
      const response = await Promise.all([ ...req.files.map(file => unLink(file.path)),
                          ...req.files.map(({size, mimetype, ...file}) => pool.promise().query(`INSERT INTO product_images(aws_name, size, mimetype, project_id, isThumb)
                          VALUES(?,?,?,?,?)`,[file.filename, size, mimetype, project_id, false]))])
      const files = req.files.map(({size, mimetype, ...file},idx) => {return {awsName: file.filename, size, mimetype, id: response[req.files.length + idx][0].insertId}})
                          
      res.send(files)
    }catch(e){
      console.log(e);
      res.send({message:"Internal server error", code: 51})
    }

  })
  
}