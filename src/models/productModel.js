const mongoose = require('mongoose')
const productsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    currencyId:{
        type:String,
        required:true,
        trim:true
    },
    currencyFormat:{
        type:String,
        required:true,
        trim:true
    },
    isFreeShiping:{
        type:Boolean,
        default:false,
        trim:true
    },
    productImage:{
        type:String,
        required:true,
        trim:true
    },
    style:{
        type:String,
        trim:true
    },
    availableSizes:{
        type:[String],
        enum:['S','XS','M','X','L','XXL','XL'],
        trim:true
    },
    installments:{
        type:Number,
        trim:true
    },
    deletedAt:Date,
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})
module.exports = mongoose.model('products', productsSchema)



/*
title: {string, mandatory, unique},
  description: {string, mandatory},
  price: {number, mandatory, valid number/decimal},
  currencyId: {string, mandatory, INR},
  currencyFormat: {string, mandatory, Rupee symbol},
  isFreeShipping: {boolean, default: false},
  productImage: {string, mandatory},  // s3 link
  style: {string},
  availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
  installments: {number},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  createdAt: {timestamp},
  updatedAt: {timestamp},
s
  */