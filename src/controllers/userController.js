const bcrypt = require('bcrypt');
const aws = require("aws-sdk");
const {validator, jwt} = require('../utils')
//const {systemConfig} = require('../configs')
const userModel = require('../models/userModel')
//--------------------------------function for uploading profile image------------------------------------
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) { // exactly 
      
      // Create S3 service object
      let s3 = new aws.S3({ apiVersion: "2006-03-01" });
      var uploadParams = {
        ACL: "public-read", // this file is publically readable
        Bucket: "classroom-training-bucket", // HERE
        Key: "group2/project-5/" + file.originalname, // HERE    "group2/project-5/profileImage.png" 
        Body: file.buffer, 
      };
  
      // Callback - function provided as the second parameter ( most oftenly)
      s3.upload(uploadParams , function (err, data) {
        if (err) {
          return reject( { "error": err });
        }
        console.log(data)
        console.log(`File uploaded successfully. ${data.Location}`);
        return resolve(data.Location); //HERE 
      });
    });
  };
  //---------------------------------API to upload profile image-------------------------------------------
  const uploadImage= async function (req, res) {
    try {
      let files = req.files;
      if (files && files.length > 0) {
        //upload to s3 and return true..incase of error in uploading this will goto catch block( as rejected promise)
        let uploadedFileURL = await uploadFile( files[0] ); // expect this function to take file as input and give url of uploaded file as output 
        res.status(201).send({ status: true, data: uploadedFileURL });
  
      } 
      else {
        res.status(400).send({ status: false, msg: "No file to write" });
      }
  
    } 
    catch (e) {
      console.log("error is: ", e);
      res.status(500).send({ status: false, msg: "Error in uploading file to s3" });
    }
  
  }



//---------------------------1st API To Register user ------------------------------------------------
const registerUser = async function (req, res){
    try{
        
    const requestBody = req.body;
        if(!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({status: false, message: 'Invalid request parameters. Please provide user details'})
        }

        // Extract params
        let {fname, lname, email, profileImage, phone, password, address} = requestBody; // Object destructing

        // Validation starts
        if(!validator.isValid(fname)) {
            return res.status(400).send({status: false, message: 'first name is required'})
        }
        if(!validator.isValid(lname)) {
            return res.status(400).send({status: false, message: 'last name is required'})
        }
        if(!validator.isValid(email)) {
            return res.status(400).send({status: false, message: `Email is required`})
        }
        
        if(!validator.validateEmail(email)) {
            return res.status(400).send({status: false, message: `Email should be a valid email address`})
        }
        let isEmailAlredyPresent = await userModel.findOne({ email: requestBody.email })

        if (isEmailAlredyPresent) {
            return res.status(400).send({ status: false, message: `Email Already Present` });
        }
        if(!validator.isValid(profileImage)) {
            return res.status(400).send({status: false, message: `profileImage is required`})
        }
        if(!validator.isValid(phone)) {
            return res.status(400).send({status: false, message: 'Phone number is required'})
        }
        if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
            //if (!/^\+(?:[0-9] ?){10,12}[0-9]$/.test(mobile)) {
            return res.status(400).send({ status: false, message: `Mobile should be a valid number` });

        }
        /*if(!validator.isValidNumber(phone)) {
            return res.status(400).send({status: false, message: 'Phone number should be a valid number'})
        }*/
        let isPhoneAlredyPresent = await userModel.findOne({ phone: requestBody.phone })

        if (isPhoneAlredyPresent) {
            return res.status(400).send({ status: false, message: `Phone Already Present` });
        }
        if(!validator.isValid(password)) {
            return res.status(400).send({status: false, message: `Password is required`})
        }
        if(!validator.isValidLength(password, 8, 15)) {
            return res.status(400).send({status: false, message: `Password length must be between 8 to 15 char long`})
        }
        if(!validator.isValid(address.shipping.street)) {
            return res.status(400).send({status: false, message: 'shipping street is required'})
        }
        if(!validator.isValid(address.shipping.city)) {
            return res.status(400).send({status: false, message: 'shipping city is required'})
        }
        if(!validator.isValid(address.shipping.pincode)) {
            return res.status(400).send({status: false, message: 'shipping pincode is required'})
        }
        if(!validator.isValid(address.billing.street)) {
            return res.status(400).send({status: false, message: ' billing street is required'})
        }
        if(!validator.isValid(address.billing.city)) {
            return res.status(400).send({status: false, message: 'billing city is required'})
        }
        if(!validator.isValid(address.billing.pincode)) {
            return res.status(400).send({status: false, message: 'billing pincode is required'})
        }
        // Validation ends
        /*bcrypt.hash(password, saltRounds, (err, hash) => {
            
            //return hash
            // Now we can store the password hash in db.
          });*/
          const salt = await bcrypt.genSalt(10);
          password=password.toString()
          await bcrypt.hash(password,salt)
        const userData = {fname, lname, email, profileImage, phone, password, address}
        const newUser = await userModel.create(userData);
        return res.status(201).send({status: true, message: `User created successfully`, data: newUser})
    }
    catch(error){
        return res.status(500).send({status: false, message: error.message})
     }
}
module.exports = {
    registerUser,uploadImage
}
