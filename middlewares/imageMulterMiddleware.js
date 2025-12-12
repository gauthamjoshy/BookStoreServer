const multer = require("multer")

const storage = multer.diskStorage({
    destination : (res, file, cb)=>{
        cb(null, "./imgUploads")
    },
    filename : (res, file, cb)=>{
        cb(null, `Image - ${Date.now()}-${file.originalname}`)
    }

})

const fileFilter = (res, file, cb)=>{
    if(file.mimetype == `image/jpg` || file.mimetype == `image/jpeg` || file.mimetype == `image/png` ){
        cb(null, true)
    }else{
        cb(null, false)
        return cb(new Error ("Accepts only png, jpg and jpeg files"))
    }
}

const multerConfig = multer({
    storage,
    fileFilter
})


module.exports = multerConfig