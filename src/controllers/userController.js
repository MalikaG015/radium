const bcrypt = require("bcrypt");
const aws = require("aws-sdk");
const { validator, jwt} = require("../utils");

//const jwt = require('jsonwebtoken')
const { systemConfig } = require("../configs");
const userModel = require("../models/userModel");
//----------------------------------------function to upload function---------------------------------
let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) { // exactly 
    
    // Create S3 service object
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });
    var uploadParams = {
      ACL: "public-read", // this file is publically readable
      Bucket: "classroom-training-bucket", // HERE
      Key: "project-5/group2/" + file.originalname, // HERE    "pk_newFolder/harry-potter.png" pk_newFolder/harry-potter.png
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

//---------------------------1st API To Register user ------------------------------------------------
const registerUser = async function (req, res) {
  try {
    const requestBody = req.body;
    //const JSONBody=JSON.parse(requestBody)
    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
    }

    // Extract params
    let { fname, lname, email, profileImage, phone, password, address } = requestBody; // Object destructing

    // Validation starts
    if (!validator.isValid(fname)) {
      return res.status(400).send({ status: false, message: 'first name is required' })
    }
    if (!validator.isValid(lname)) {
      return res.status(400).send({ status: false, message: 'last name is required' })
    }
    if (!validator.isValid(email)) {
      return res.status(400).send({ status: false, message: `Email is required` })
    }

    if (!validator.validateEmail(email)) {
      return res.status(400).send({ status: false, message: `Email should be a valid email address` })
    }
    let isEmailAlredyPresent = await userModel.findOne({ email: requestBody.email })

    if (isEmailAlredyPresent) {
      return res.status(400).send({ status: false, message: `Email Already Present` });
    }

    if (!validator.isValid(phone)) {
      return res.status(400).send({ status: false, message: 'Phone number is required' })
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
    if (!validator.isValid(password)) {
      return res.status(400).send({ status: false, message: `Password is required` })
    }
    if (!validator.isValidLength(password, 8, 15)) {
      return res.status(400).send({ status: false, message: `Password length must be between 8 to 15 char long` })
    }

    if (!validator.isValid(address)) {
      return res.status(400).send({ status: false, message: 'address is required' })
    }
    if (!validator.isValid(address.shipping)) {
      return res.status(400).send({ status: false, message: 'shipping address is required' })
    }
    if (!validator.isValid(address.shipping.street)) {
      return res.status(400).send({ status: false, message: 'shipping street is required' })
    }
    if (!validator.isValid(address.shipping.city)) {
      return res.status(400).send({ status: false, message: 'shipping city is required' })
    }
    if (!validator.isValid(address.shipping.pincode)) {
      return res.status(400).send({ status: false, message: 'shipping pincode is required' })
    }
    if (!validator.isValid(address.billing)) {
      return res.status(400).send({ status: false, message: 'billing address is required' })
    }
    if (!validator.isValid(address.billing.street)) {
      return res.status(400).send({ status: false, message: ' billing street is required' })
    }
    if (!validator.isValid(address.billing.city)) {
      return res.status(400).send({ status: false, message: 'billing city is required' })
    }
    if (!validator.isValid(address.billing.pincode)) {
      return res.status(400).send({ status: false, message: 'billing pincode is required' })
    }
    // Validation ends
    let files = req.files;
    if (files && files.length > 0) {
      let uploadedFileURL = await uploadFile(files[0]);
      const encrypt = await bcrypt.hash(password, 10)
      const userData = { fname, lname, email, profileImage: uploadedFileURL, phone, password: encrypt, address }
      const newUser = await userModel.create(userData);
      return res.status(201).send({ status: true, message: `User created successfully`, data: newUser })
    }
    else {
      res.status(400).send({ status: false, msg: "No file to write" });
    }
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}
//----------------------------loginUser-------------------------------------------------------

const loginUser = async function (req, res) {
  try {
    const requestBody = req.body;

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({status: false,message: "Invalid request parameters. Please provide login details",
        });
      }

    // Extract params
    const { email, password } = requestBody;

    // Validation starts
    if (!validator.isValid(email)) {return res.status(400).send({ status: false, message: `Email is required` });
    }

    if (!validator.validateEmail(email)) {
      return res.status(400).send({status: false,message: `Email should be a valid email address`});
    }

    if (!validator.isValid(password)) {
      return res.status(400).send({ status: false, message: `Password is required` });
    }

    // Validation ends
    console.log(email, password)

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send({ status: false, message: `user not exist` });
    }

    //console.log(user)
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword)

    if (validPassword) {
      console.log(email, validPassword)

      const token = await jwt.createToken({
        userId: user._id, iat: Math.floor(Date.now() / 1000),//issue date
         exp:Math.floor(Date.now()/1000)+30 *60       //expiry  date
      });

      return res.status(200).send({status: true,message: `User login successfull`,data: { userId: user._id, token: token },
        });
    }
    else {
      return res.status(400).send({ status: false, message: `put correct Password` });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

//----------------------------getUserProfile-------------------------------------------------------

const getUserProfile = async function (req, res) {
  try {
    const user_Id = req.params.userId;
    const userId = req.userId;

    // console.log(typeof userId)
    if (!validator.isValidObjectId(user_Id)) {
      return res.status(400).send({ status: false, message: `${userId} is not a valid user id` });
    }

    const user = await userModel.findById({ _id: user_Id });

    if (!user) {
      return res.status(404).send({ status: false, message: `User does not exit` });
    }
      if (user["_id"].toString() !== userId) {
      return res.status(401).send({status: false,message: `Unauthorized access! user info doesn't match`});
      
    }

    return res.status(200) .send({ status: true, message: "User profile details", data: user });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-----------------------------update1 user profile---------------------------------------------
const updateUser1 = async function (req, res) {

  try {
    let files = req.files;
      const requestBody = req.body
      const params = req.params
      const userId = params.userId  //req.params.userId
      const userIdFromToken = req.userId

     

      if (!validator.isValidObjectId(userId)) {
          res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
          return
      }

      if (!validator.isValidObjectId(userIdFromToken)) {
          return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
      }

      const user = await userModel.findOne({ _id: userId})
      if (!user) {
          return res.status(404).send({ status: false, message: `user not found` })
      }

      if(userId.toString() !== userIdFromToken) {
          res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
          return
      }

      if (!validator.isValidRequestBody(requestBody)) {
          res.status(400).send({ status: false, message: 'No paramateres passed. user unmodified' })
          return
      }

      // Extract params
      let { fname, lname,email,profileImage,phone,password, address} = requestBody;
      let obj={}
      if(validator.isValidString(fname)){
        obj['fname']=fname
      }
      if(validator.isValidString(lname)){
        obj['lname']=lname
      }
      if(validator.isValidString(email)){
        if (!validator.validateEmail(email)) {
           return res.status(400).send({ status: false, message: `Email should be a valid email address` })
        }
        let isEmailAlredyPresent = await userModel.findOne({ email: requestBody.email })

         if (isEmailAlredyPresent) {
          return res.status(400).send({ status: false, message: `Email Already Present` });
    }
          //already present, VALID(done)
          obj['email']=email
      }
      if(validator.isValidNumber(phone)){
        if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
          return res.status(400).send({ status: false, message: `Mobile should be a valid number` });
        }
        let isPhoneAlredyPresent = await userModel.findOne({ phone: requestBody.phone })

        if (isPhoneAlredyPresent) {
        return res.status(400).send({ status: false, message: `Phone Already Present` });
    }
        //already present, VALID(done)
        obj['phone']=phone
      }
      if(validator.isValidString(password)){
        const encrypt = await bcrypt.hash(password, 10)
        obj['password']=encrypt
      }
      if (address) {
        address = JSON.parse(address)
        if (address.shipping) {
            if (address.shipping.street) {
                if (!validator.isValid(address.shipping.street)) {
                    return res.status(400).send({ status: false, message: ' Please provide street' })
                }
              obj['address.shipping.street'] = address.shipping.street
            }
            if (address.shipping.city) {
                if (!validator.isValid(address.shipping.city)) {
                    return res.status(400).send({ status: false, message: ' Please provide city' })
                }
                obj['address.shipping.city'] = address.shipping.city
            }
            if (address.shipping.pincode) {
                if (typeof address.shipping.pincode !== 'number'){
                    return res.status(400).send({ status: false, message: ' Please provide pincode' })
                }
                obj['address.shipping.pincode'] = address.shipping.pincode
            }
        }
        if (address.billing) {
          if (address.billing.street) {
              if (!validator.isValid(address.billing.street)) {
                  return res.status(400).send({ status: false, message: ' Please provide street' })
              }
              obj['address.billing.street'] = address.billing.street
          }
          if (address.billing.city) {
              if (!validator.isValid(address.billing.city)) {
                  return res.status(400).send({ status: false, message: ' Please provide city' })
              }
              obj['address.billing.city'] = address.billing.city
          }
          if (address.billing.pincode) {
              if (typeof address.billing.pincode !== 'number') {
                  return res.status(400).send({ status: false, message: ' Please provide pincode' })
              }
              obj['address.billing.pincode'] = address.billing.pincode
          }
      }
  } 
  if (files && files.length > 0){
  let uploadedFileURL = await uploadFile(files[0]);
  if(uploadedFileURL){
  obj['profileImage']=uploadedFileURL
  }
}
const updatedUserData = await userModel.findOneAndUpdate({ _id: userId },obj,{new:true})
          res.status(201).send({ status: true, data: updatedUserData })
        }
  catch (error) {
      res.status(500).send({ status: false, msg: error.message });
  }
}



module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser1
};
