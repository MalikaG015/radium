const { validator } = require("../utils");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

//------------------------------1st API to add products in the cart/create cart------------------------------
const createCart = async function (req, res) {
  try {
    const userId = req.params.userId
    const requestBody = req.body
    const userIdFromToken = req.userId
    let { items } = requestBody

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false, message: "Invalid request parameters. Please provide login details",
      });
    }
    if (!validator.isArray(items)) {
      return res.status(400).send({ status: false, message: `Items required` });
    }

    if (!validator.isValidObjectId(userIdFromToken)) {
      return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
    }

    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid user id" })
    }
    const user = await userModel.findById({ _id: userId })
    if (!user) {
      res.status(400).send({ status: false, msg: "user not found" })
    }
    if (userId.toString() !== userIdFromToken) {
      res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
      return
    }
    //authentication required
    const cartCheck = await cartModel.findOne({ userId: userId })

    //cart not exists
    //items:[{},{},{}]
    if (cartCheck == null) {
      const totalItems1 = items.length
      const product = await productModel.findOne({ _id: items[0].productId, isDeleted: false })
      if (!product) {
        return res.status(400).send({ status: false, message: `Product not found` });
      }
      const totalPrice1 = product.price * items[0].quantity
      const cartData = { items: items, totalPrice: totalPrice1, totalItems: totalItems1, userId: userId }
      const createCart = await cartModel.create(cartData)
      return res.status(201).send({ status: true, message: `cart created successfully`, data: createCart })
    }
    else {
      //add products in the cart
      // we are writing items[0] because we are sending array from postman
      const product = await productModel.findOne({ _id: items[0].productId }, { isDeleted: false })
      if (!product) {
        return res.status(400).send({ status: false, message: `Product not found` });
      }
      const totalPrice1 = cartCheck.totalPrice + (product.price * items[0].quantity)
      for (let i = 0; i < cartCheck.items.length; i++) {
        if (cartCheck.items[i].productId == items[0].productId) {
          cartCheck.items[i].quantity = cartCheck.items[i].quantity + items[0].quantity
          const response = await cartModel.findOneAndUpdate({ userId: userId }, { items: cartCheck.items, totalPrice: totalPrice1 }, { new: true })
          return res.status(201).send({ status: true, message: `product added in the cart successfully`, data: response })
        }
      }
      const totalItems1 = items.length + cartCheck.totalItems
      const cartData = await cartModel.findOneAndUpdate({ userId: userId }, { $addToSet: { items: { $each: items } }, totalPrice: totalPrice1, totalItems: totalItems1 }, { new: true })
      return res.status(201).send({ status: true, message: `product added in the cart successfully`, data: cartData })

    }
  }
  catch (error) {
    return res.status(400).send({ status: false, message: error.message })
  }
}
//-------------------------------2nd API to remove products from cart----------------------------------------
const updateCart = async function (req, res) {
  try {
    const userId = req.params.userId
    const userIdFromToken = req.userId

    if (!validator.isValidObjectId(userIdFromToken)) {
      return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
    }
    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid user id" })
    }
    const user = await userModel.findById({ _id: userId })
    if (!user) {
      return res.status(400).send({ status: false, msg: "user not found" })
    }
    if (userId.toString() !== userIdFromToken) {
      res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
      return
    }
    //authentication required
    const requestBody = req.body
    let { productId, removeProduct, cartId } = requestBody
    //validation---product id, cartid, req body
    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide details" });
    }
    if (!validator.isValidObjectId(productId)) {
      return res.status(400).send({ status: false, msg: "Invalid product id" })
    }
    if (!validator.isValidObjectId(cartId)) {
      return res.status(400).send({ status: false, msg: "Invalid cart id" })
    }
    //console.log("hii", removeProduct)
    const findCart = await cartModel.findOne({ _id: cartId })
    console.log("product id=", productId)
    if (!findCart) {

      return res.status(400).send({ status: false, message: `cart does not exist` })
    }
    const product = await productModel.findOne({ _id: req.body.productId, isDeleted: false })
    if (!product) {
      return res.status(400).send({ status: false, message: `Product not found` });
    }
    //console.log("productttttt=",product)
    if (removeProduct == 1) {
      //const totalItems1=findCart.totalItems-1
      for (let i = 0; i < findCart.items.length; i++) {
        if (findCart.items[i].productId == productId) {
          //remove that productId from items array
          const updatedPrice = findCart.totalPrice - product.price
          findCart.items[i].quantity = findCart.items[i].quantity - 1
          if (findCart.items[i].quantity > 0) {
            const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalPrice: updatedPrice }, { new: true })
            return res.status(201).send({ status: true, message: `One product removed from the cart successfully`, data: response })
          }
          else {
            const totalItems1 = findCart.totalItems - 1
            findCart.items.splice(i, 1)
            const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalItems: totalItems1, totalPrice: updatedPrice }, { new: true })
            return res.status(201).send({ status: true, message: `1 product removed from the cart successfully`, data: response })

          }
        }

      }
    }
    if (removeProduct == 0) {
      for (let i = 0; i < findCart.items.length; i++) {
        if (findCart.items[i].productId == productId) {
          const updatedPrice = findCart.totalPrice - (product.price * findCart.items[i].quantity)
          const totalItems1 = findCart.totalItems - 1
          //remove that productId from items array
          findCart.items.splice(i, 1)
          const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalItems: totalItems1, totalPrice: updatedPrice }, { new: true })
          return res.status(201).send({ status: true, message: ` product removed from the cart successfully`, data: response })

        }
      }
    }
  }
  catch (error) {
    return res.status(500).send({ status: false, msg: error.message })
  }
}
//-------------------------3rd API to get cart summary---------------------------------------
const getCart = async function (req, res) {
  try {
    const userId = req.params.userId
    const userIdFromToken = req.userId
    const user = await userModel.findOne({ _id: userId })
    if (!user) {
      return res.status(400).send({ status: false, msg: "User not found" })
    }
    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid user id" })
    }
    if (!validator.isValidObjectId(userIdFromToken)) {
      return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
    }
    if (userId.toString() !== userIdFromToken) {
      res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
      return
    }

    const cartData = await cartModel.findOne({ userId: userId })
    if (!cartData) {
      return res.status(400).send({ status: false, msg: "Cart not found" })
    }
    //const data=await cartModel.findOne({userId:userId})
    return res.status(201).send({ status: true, msg: " your cart details are", data: cartData })
  }
  catch (error) {
    return res.status(500).send({ status: false, msg: error.message })
  }
}
//--------------------------------------4th api to delete cart --------------------------------------------------
const deleteCart = async function (req, res) {
  try {
    const userId = req.params.userId   
    
    const userIdFromToken = req.userId
    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid user id" })
    }
    const user = await userModel.findOne({ _id: userId })
    if (!user) {
      return res.status(400).send({ status: false, msg: "user not found" })
    }

    if (userId.toString() !== userIdFromToken) {
      return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
    }
    const cartData = await cartModel.findOne({ userId: userId })
    if (!cartData) {
      return res.status(400).send({ status: false, msg: "Cart not found" })
    }
    //const findCart = await cartModel.findOne({ _id: cartId })
    cartData.items.splice(cartData.items[0], cartData.items.length - 1)
     await cartModel.findOneAndUpdate({ userId:userId }, { items: cartData.items, totalItems: 0, totalPrice: 0 }, { new: true })
    return res.status(201).send({ status: true, message: ` cart removed successfully` })

  }
  catch (error) {
    return res.status(500).send({ status: false, msg: error.message})

  }
}
//-------------------------------------------------------------------------------------------------------
module.exports = {
  createCart,
  updateCart,
  getCart,
  deleteCart
};
