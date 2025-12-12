const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    noOfPages : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    dPrice : {
        type : Number,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    abstract : {
        type : String,
        required : true
    },
    publisher : {
        type : String,
        required : true
    },
    languages : {
        type : String,
        required : true
    },
    isbn : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    uploadImages : {
        type : Array,
        required : true
    },
    userMail : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default :"pending"
    },  
    boughtBy : {
        type : String,
        default : ""
    }
})

const books = mongoose.model("books", bookSchema)
module.exports = books