const aws = require('aws-sdk')
const sharp = require('sharp')
const request = require('request')
const { readFileSync } = require('fs');
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const cfAccessKey = process.env.AWS_CLOUDFRONT_ACCESS_KEY_ID
const cfpk = readFileSync(process.env.AWS_CLOUDFRONT_PRIVATE_KEY_PATH).toString('ascii')
const signer = new aws.CloudFront.Signer(cfAccessKey, cfpk)
const s3Client = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey
})

exports.uploadFile = (file) => {
  return new Promise(async (resolve, reject)=>{
    try{
      //Compress image and convert to jpg
      const buffer = await sharp(file.path)
      .jpeg({ mozjpeg: true, quality: 70 })
      .toBuffer()

      const uploadParams = {
        Bucket: bucketName,
        Body: buffer,
        ContentType: 'image/jpg',
        Key: file.filename
      }
      resolve(s3Client.upload(uploadParams).promise())
    }catch(e){
      reject(e);
    }
  })
}

exports.getFileStream = (fileKey) => {

  const signedUrl = signer.getSignedUrl(
    { 
      url: 'https://'+process.env.AWS_CLOUDFRONT_URL + '/' + fileKey, 
      expires:Math.floor((Date.now() + 15*1000)/1000)
    });
  return request(signedUrl)
}