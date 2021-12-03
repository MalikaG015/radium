const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    fullName: {
        type: String,
        required: true
    },
    logoLink: {
        
    }, 
    isDeleted: {
        type: Boolean,
        default: false
        }
    }, { timestamps: true })

module.exports = mongoose.model('CollegeDb', collegeSchema)

