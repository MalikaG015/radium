const AuthorModel= require("../models/authorModel.js")
const BookModel= require("../models/bookModel.js")

const createBook= async function (req, res) {
    var book= req.body
    let savedData= await BookModel.create(book)
    res.send({msg: savedData})    
}
const createAuthor= async function (req, res) {
    var author= req.body
    let savedData1= await AuthorModel.create(author)
    res.send({msg: savedData1})    
}
const getBookWithAuthorName=async function(req,res){
    let allBooks=await AuthorModel.findOne({name:"Chetan Bhagat"}).select({author_id:1,_id:0})
    let booksWritten=await BookModel.find(allBooks).select({name:1,_id:0})
     res.send({msg:booksWritten});
}
const updatePrice=async function(req,res){
    let allBooks1=await BookModel.findOne({name:"Two States"}).select({author_id:1,_id:0})
    let author2=await AuthorModel.find(allBooks1).select({author_name:1,_id:0})
    let uprice=await BookModel.findOneAndUpdate({name:"Two States"},{price:100},{new:true}).select({price:1,_id:0})
    res.send({msg:author2,uprice})
}
const findBooks=async function(req,res){
    let allBooks2=await BookModel.find({price: {$gt: 49,$lte:100}}).select({author_id:1,_id:0})
    let author1=await AuthorModel.find({$or:allBooks2}).select({author_name:1, _id:0})
    res.send({msg:author1});
}

module.exports.createBook= createBook
module.exports.createAuthor= createAuthor
module.exports.getBookWithAuthorName= getBookWithAuthorName
module.exports.updatePrice=updatePrice
module.exports.findBooks=findBooks;