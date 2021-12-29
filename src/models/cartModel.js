const mongoose = require('mongoose')
const ObjectId=mongoose.Schema.Types.ObjectId
const cartSchema = new mongoose.Schema({
    userId:{
        type:ObjectId,
        ref:'user',
        required:true,
        unique:true,
        trim:true
    },
    items:[{
        productId:{
            type:ObjectId,
            ref:'products',
            required:true,
            trim:true,
            _id:false
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
            trim:true
        }
    }],
    totalPrice:{
        type:Number,
        required:true,
        trim:true
    },
    totalItems:{
        type:Number,
        required:true,
        trim:true
    }
},{timeStamps:true})
module.exports = mongoose.model('cart', cartSchema)

//trk: [{lat:Number, lng:Number}]

// {
//     userId: {ObjectId, refs to User, mandatory, unique},
//     items: [{
//       productId: {ObjectId, refs to Product model, mandatory},
//       quantity: {number, mandatory, min 1}
//     }],
//     totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
//     totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }