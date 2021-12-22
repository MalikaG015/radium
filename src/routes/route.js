const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
  secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
  region: "ap-south-1" // Mumbai region
});


const UserController = require('../controller/userController')
const BookController=require('../controller/booksController')
const ReviewController=require('../controller/reviewController')
const loginCheck=require('../Middleware/userAuth')

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});


//registerUser API
router.post("/register", UserController.registerUser)
//LoginUser API
router.post('/login', UserController.loginUser)
// create Book API
router.post('/books',loginCheck.userAuth,BookController.createBook)   //!----
//AWS
router.post("/write-file-aws",BookController.uploadImage)
// get Books  API
router.get('/books',loginCheck.userAuth,BookController.getBooks)
// get BooksByID API
router.get('/books/:bookId',loginCheck.userAuth, BookController.getBooksByID)
// put update API 
router.put('/books/:bookId' ,loginCheck.userAuth,BookController.updateBooks ) //!-----
// Delete Book API
router.delete('/books/:bookId' ,loginCheck.userAuth,BookController.deleteByBookId) //!-------

//Review API
//Create Review API
router.post('/books/:bookId/review',ReviewController.createReview)
//update review API
router.put('/books/:bookId/review/:reviewId', ReviewController.updateReview)
//Delete Review API
router.delete('/books/:bookId/review/:reviewId',ReviewController.deleteReview )
module.exports = router;