const express = require('express');
const router = express.Router();
const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
  secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
  region: "ap-south-1" // Mumbai region
});

const UserController = require('../controllers/userController')
router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});
//----------user register ---------------------------------------------------------------
router.post("/register", UserController.registerUser)
router.post("/upload-Profile-picture", UserController.uploadImage)

module.exports = router;