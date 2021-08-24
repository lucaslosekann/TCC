const multer = require('multer')
exports.multiImageUpload = multer({
    dest:'./uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            if(!req.body.project_id){
                const err = new Error('Must provide project id')
                err.name = 42;
                return cb(err);
            }else{
                //Tudo certo
                cb(null, true);
            }
        } else {
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 43;
            return cb(err);
        }
    },
}).array('images', 10)