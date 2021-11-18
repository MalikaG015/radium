const BookModel = require("../models/bookModel.js");
const mongoose = require("mongoose");
const authorModel = require("../models/authorModel.js");
const publisherModel = require("../models/publisherModel.js");

const createBook = async function (req, res) {
  const data = req.body;
  let authorId=req.body.author;
  let publisherId=req.body.publisher;
  let authorFromRequest=await authorModel.findById(authorId);
  let publisherFromRequest=await publisherModel.findById(publisherId);

  if(authorFromRequest && publisherFromRequest){
    let bookCreated = await BookModel.create(data);
    res.send({ data: bookCreated });
    
  }
  else if(authorFromRequest && !publisherFromRequest){
    res.send("the publisher id provided is not valid")
}
else if(!authorFromRequest && publisherFromRequest){
  res.send("author id provided is wrong");
}
}
const getBooks=async function(req,res){
  let allBooks =await BookModel.find().populate({path:"author",select:{"author_name":1,"age":1,_id:1}}).populate('publisher')
  res.send(allBooks);
}


module.exports.createBook = createBook;
module.exports.getBooks = getBooks;

