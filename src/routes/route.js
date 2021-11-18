const express = require('express');
const router = express.Router();
//const UserModel= require("../models/userModel")

const AuthorController= require("../controllers/authorController")
const BookController= require("../controllers/bookController")
const publisherController= require("../controllers/publisherController")

//const BookController= require("../controllers/bookController")
//const AssignmentBookController= require("../controllers/assignmentBookController")


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

router.post('/createAuthor',  AuthorController.createAuthor  );
router.post('/createBook',  BookController.createBook );
router.get('/getBooks',  BookController.getBooks );
router.post('/createPublishers', publisherController.createPublisher);




module.exports = router;