const express = require('express');
const router = express.Router();
//const UserModel= require("../models/userModel")

const UserController= require("../controllers/userController")


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

router.post('/createBook',  UserController.createBook);
router.post('/createAuthor',  UserController.createAuthor);
router.get('/listBooks',  UserController.getBookWithAuthorName  );
router.get('/updatePrice',  UserController.updatePrice  );
router.get('/findBooks',  UserController.findBooks  );




module.exports = router;