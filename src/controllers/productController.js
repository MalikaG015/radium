const { validator } = require("../utils");
const aws = require("aws-sdk");
//const { systemConfig } = require("../configs");
const productModel = require("../models/productModel");



const isValidAvailableSizes = function (sizes) {
  return ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'].indexOf(sizes) !== -1
}
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
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ "error": err });
      }
      console.log(data)
      console.log(`File uploaded successfully. ${data.Location}`);
      return resolve(data.Location); //HERE 
    });
  });
};

//--------------------------------------1st API To create product------------------------------------
const createProduct = async function (req, res) {
  try {
    const requestBody = req.body;
    let productData = requestBody.productData//req.body.productData
    productData = JSON.parse(productData)

    console.log(requestBody)
    //requestBody=JSON.parse(requestBody)

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ staus: false, message: 'Invalid request parameters. Please Provide Product Details' })
    }

    // Extract params
    let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = productData; //(req.body.productData.title) Object destructing

    // Validation starts
    /*if (!validator.isValidAvailableSizes(availableSizes)) {
      return res.status(400).send({ status: false, message: " please provide valid size" })
  }*/
    const validSizes = availableSizes.filter(size => { return validator.isValidAvailableSizes(size) })
    if (validSizes.length == 0) {
      return res.status(400).send({ status: false, message: " please provide atleast one size" })
    }
    /*const objArrayKey = Object.keys(requestBody)// we got array of keys
         const objArrayValues = Object.values(requestBody)// we got array of Values 
         console.log(objArrayValues)

         const check = objArrayValues.map((e)=>{
            if(!validator.isValid(e)){
               
             //throw new Error("invalid book id")
             return res.status(400).send({ status: false, message: `${e} is required` })
             }
           // return res.status(400).send({ status: false, message: `${e} is required` })
         })
         console.log(check)
         */
    if (!validator.isValid(title)) {
      return res.status(400).send({ status: false, message: 'Title is required' })
    }

    let isTitleAlreadyExist = await productModel.findOne({ title })
    if (isTitleAlreadyExist) {
      return res.status(400).send({ status: false, message: `Title Already Present` });
    }
    if (!validator.isValid(description)) {
      return res.status(400).send({ status: false, message: 'description is required' })
    }
    if (!validator.isValid(price)) {
      return res.status(400).send({ status: false, message: `price is required` })
    }
    if (!validator.isValid(currencyId)) {
      return res.status(400).send({ staus: false, message: `currencyId is required` })
    }
    if (!validator.isValid(currencyFormat)) {//sync
      return res.status(400).send({ status: false, message: 'currencyFormat is required' })
    }
    let files = req.files;
    if (files && files.length > 0) {
      let uploadedFileURL = await uploadFile(files[0]);//asyn

      const data = {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        currencyId: productData.currencyId,
        currencyFormat: productData.currencyFormat,
        isFreeShipping: productData.isFreeShipping,
        productImage: uploadedFileURL,
        style: productData.style,
        availableSizes: validSizes,
        installments: productData.installments
      }

      const newProduct = await productModel.create(data);
      console.log(newProduct)
      return res.status(201).send({ status: true, message: "Product added succsessfully", data: newProduct });
    }
    else {
      res.status(400).send({ status: false, msg: "No file to write" });
    }
  }
  catch (e) {
    return res.status(500).send({ status: false, message: e.message })
  }
}
//--------------------------------------2nd API for get products by filters------------------------------
const getProducts = async function (req, res) {
  try {
    let filter = { isDeleted: false }
    const queryParams = req.query
    if (validator.isValidRequestBody(queryParams)) {

      //const data = await productModel.find({title:{$regex:name ,$options:"$i"}})//.sort({ price})

      const { availableSizes, name, price, priceSort } = queryParams;

      if (validator.isValid(availableSizes)) {
        filter['availableSizes'] = availableSizes
      }
      if (validator.isValid(name)) {

        filter['title'] = { $regex: name }
      }

      let priceGreaterThan = req.query.priceGreaterThan
      let priceLessThan = req.query.priceLessThan
      if (priceGreaterThan && priceLessThan) {
        if (validator.isValid(priceGreaterThan && priceLessThan)) {
          filter['price'] = { $gte: priceGreaterThan, $lte: priceLessThan }

        }

      }
      if (priceGreaterThan) {
        if (validator.isValid(priceGreaterThan)) {
          filter['price'] = { $gte: priceGreaterThan }

        }

      }
      if (priceLessThan) {
        if (validator.isValid(priceLessThan)) {
          filter['price'] = { $lte: priceLessThan }

        }

      }
      const data = await productModel.find(filter).sort({ price: priceSort })//title and sizes
      if (Array.isArray(data) && data.length === 0) {
        return res.status(404).send({ status: false, message: 'No data found' })
      }

      return res.status(200).send({ status: true, message: 'product lists', data: data })
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

//---------------------------get Product By Id ------------------------------------------------
const getProductById = async function (req, res) {
  try {
    const productId = req.params.productId

    if (!validator.isValid(productId)) {
      return res.status(400).send({ status: false, message: `provide a Product Id` })
    }
    if (!validator.isValidObjectId(productId)) {
      return res.status(400).send({ status: false, message: `Product Id is not valid Product Id` })
    }
    const product = await productModel.findOne({ _id: productId, isdeleted: false }).select({ __v: 0 })
    if (!product) {
      return res.status(404).send({ status: false, message: `Product not exist` })
    }

    return res.status(200).send({ status: true, message: 'Success', data: product });


  } catch (e) {
    return res.status(500).send({ status: false, message: e.message })
  }

}
//---------------------------UpdateProductById------------------------------------------------

const UpdateProductById = async function (req, res) {
  try {
    const productId = req.params.productId;

    let requestBody = req.body;
    let productData = JSON.parse(requestBody.productData)


    if (!validator.isValidObjectId(productId)) {
      return res.status(400).send({ status: false, message: `invalid  Product Id` })
    }
    let filter1 = { isDeleted: false, _id: productId }
    const product = await productModel.find(filter1)

    if (!product) {
      return res.status(404).send({ status: false, message: `product not Exist` })
    }
    if (!validator.isValidRequestBody(productData)) {
      res.status(400).send({ status: false, message: 'No paramateres passed. product unmodified' })
      return
    }
    // Extract params
    let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = productData;
    //console.log(price)
    let tempObj = {}
    if (validator.isValidString(title)) {
      let istitlePresent = await productModel.findOne({ title: productData.title })

      // console.log(istitlePresent)
      if (istitlePresent) {
        return res.status(400).send({ status: false, message: `title is Already Present` });
      }

      tempObj['title'] = title;
    }

    if (validator.isValidString(description)) {

      //console.log(description)
      tempObj['description'] = description;
    }
    if (validator.isValidNumber(price)) {
      // console.log(price)
      tempObj['price'] = price
    }
    if (validator.isValidString(currencyId)) {
      tempObj['currencyId'] = currencyId
    }
    if (validator.isValidSymbol(currencyFormat)) {
      tempObj['currencyFormat'] = currencyFormat
    }
    if (validator.isValid(isFreeShipping)) {
      tempObj['isFreeShipping'] = isFreeShipping
    }

    let files = req.files;
    if (files && files.length > 0) {
      let uploadedFileURL = await uploadFile(files[0]);

      if (uploadedFileURL) {
        tempObj['productImage'] = uploadedFileURL
      }
    }
    if (validator.isValidString(productData.style)) {
      tempObj['style'] = style;
    }

    //validation remaining

    if (validator.isValid(availableSizes)) {
      const validSizes = availableSizes.filter(size => { return validator.isValidAvailableSizes(size) })
      tempObj['availableSizes'] = validSizes;
    }
    if (validator.isValidString(installments)) {
      tempObj['installments'] = installments;
    }

    const updatedProductData = await productModel.findOneAndUpdate({ _id: productId }, tempObj, { new: true })

    res.status(201).send({ status: true, message: `data upadated successfully`, data: updatedProductData })

  }
  catch (e) {
    return res.status(500).send({ status: false, message: e.message })
  }
}

//------------------------------delete product by id -----------------------------------
const deleteProduct = async function (req, res) {
  try {

    const productId = req.params.productId
    if (!validator.isValid(productId)) {
      return res.status(400).send({ status: false, message: `${productId} is not a valid book id` })
    }
    const product = await productModel.findOne({ _id: productId, isDeleted: false })

    if (!product) return res.status(404).send({ status: false, message: 'Product not exist or already deleted ' })
    const deletedProduct = await productModel.findByIdAndUpdate({ _id: productId }, { isDeleted: true, deletedAt: new Date() }, { new: true }).select({ __v: 0 })
    return res.status(202).send({ status: true, message: `product deleted Successfully`, data: deletedProduct })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  UpdateProductById
}

// ask mentor
// Q1.combination of all filters or just one filter at a time
// Q2.update product by product id-Value passed in the update key can be empty or not?
// Q3.update mei by product id-- update with new value or add to existing values?
// Q4.project-4 update code by $set method
// Q5.Which code to use for update?
