const { validator,jwt } = require("../utils");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");

//---------------------------------1st API to create order----------------------------------------
const createOrder=async function(req,res){
    try{
const userId=req.params.userId
const requestBody=req.body
const user=await userModel.findOne({_id:userId})
if(!user){
    return res.status(400).send({ status: false, msg: "user not found" })
}
const userIdFromToken = req.userId
if (userId.toString() !== userIdFromToken) {
    res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
    return
  }
let {items,totalItems,totalPrice,status,cancellable}=requestBody //cart details
if (!validator.isValidRequestBody(requestBody)) {
    res.status(400).send({ status: false, message: 'No paramateres passed. product unmodified' })
    return
  }
  if (!validator.isValidObjectId(userIdFromToken)) {
    return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
  }
if (!validator.isArray(items)) {
    return res.status(400).send({ status: false, message: `Items required` });
  }
  if(!validator.isValid(userId)){
    return res.status(400).send({ status: false, message: 'userId is required' })
}
if(!validator.isValidObjectId(userId)){
    return res.status(400).send({ status: false, message: 'userId is not valid' })
}
if(!validator.isValid(totalPrice)){
    return res.status(400).send({ status: false, message: 'total price is required' })
}
if(!validator.isValidNumber(totalPrice)){
    return res.status(400).send({ status: false, message: 'total price is not a valid number' })
}
if(!validator.isValid(totalItems)){
    return res.status(400).send({ status: false, message: 'total items are required' })
}
if(!validator.isValidNumber(totalItems)){
    return res.status(400).send({ status: false, message: 'total items are not a valid number ' })
    }
if(!validator.isValidString(status)){
        return res.status(400).send({ status: false, message: 'status is not a valid string ' })
    }   

const cartData=await cartModel.findOne({userId:userId})
let totalQuantity=0
for(let i=0;i<cartData.items.length;i++){
    totalQuantity=totalQuantity+cartData.items[i].quantity
    
}
const data={userId,items,totalItems,totalPrice,totalQuantity:totalQuantity,status,cancellable}
const orderData=await orderModel.create(data)
return res.status(201).send({status:true,msg:"order successfully placed", data:orderData})
    }
    catch(error){
        return res.status(500).send({status:false,msg:error.message})
    }
}
//------------------------------2nd API to update order status---------------------------------------
const updateOrderStatus=async function(req,res){
    try{
    const userId=req.params.userId
    const userIdFromToken = req.userId
    
    const user=await userModel.findOne({_id:userId})
    if(!user){
        return res.status(400).send({ status: false, msg: "user not found" })
    }
    if (userId.toString() !== userIdFromToken) {
        res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        return
      }
    if (!validator.isValidObjectId(userIdFromToken)) {
        return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
      }
      if (!validator.isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: " Invalid user id " })
      }
    let requestBody=req.body
    let {orderId}=requestBody
    if (!validator.isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: "Please provide order id" })
        return
      }
    if (!validator.isValidObjectId(orderId)) {
        return res.status(400).send({ status: false, message: " Invalid order id " })
      }
    const checkOrder=await orderModel.findOne({userId:userId})
    if(!checkOrder){
        return res.status(400).send({ status: false, msg: "user not found for this user id" })
    }
    const response=await orderModel.findOneAndUpdate({_id:orderId,cancellable:true},{status:"cancelled",isDeleted:true,deletedAt:new Date()},{new:true})
    const response2=await orderModel.findOne({_id:orderId,cancellable:false})
    if(response2){
        return res.status(200).send({status:true,msg:"order cannot be cancelled"})
    }
    else{
    return res.status(200).send({status:true,msg:"status updated successfully",data:response})
    }
}
catch(error){
    return res.status(500).send({status:false,msg:error.message})
}
}

//-----------------------------------------------------------------------------------------------------
module.exports = {
    createOrder,
    updateOrderStatus
};