const authorModel= require('../models/authorModel')

//const BlogsModel = require("../models/blogModel")
//const authorModel=require("./authorController.js")
const mongoose = require("mongoose")


const createAuthor= async function (req, res) {
    try{
    let authorDetails= req.body
    let check = (authorDetails.email).includes('@')
if(!check){
    res.status(400).send({status:false, msg:"enter correct email"})
}
let createdAuthor= await authorModel.create(authorDetails)
res.status(201).send({ status:true, msg:createdAuthor})
} 
catch(err){
    res.status(500).send({status:false, msg:"something went wrong",err});
}
};
module.exports.createAuthor=createAuthor
