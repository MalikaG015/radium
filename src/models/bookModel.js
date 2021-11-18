const mongoose=require('mongoose')

const bookSchema= new mongoose.Schema({
name: {
        type: String,
        required: true
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'myAuthor'
    },
    price:Number,
    ratings:Number,
    publisher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'myPublisher'
    }
    }, {timestamps: true} )

module.exports = mongoose.model( 'myBook', bookSchema ) 

