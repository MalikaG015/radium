const userModel = require('../models/userModel')
//const jwt = require('jsonwebtoken')
const productModel=require('../models/productModel')

const createUser = async function (req, res) {
    let userDetails = req.body
    // let appType = req.headers['isfreeapp']
    // let userType
    // if(appType === 'false') {
    //     userType = false
    // } else {
    //     userType = true
    // }
    userDetails.freeAppUser = req.isFreeAppUser//this attribute was set in req in the appMiddleware
    let userCreated = await userModel.create(userDetails)
    res.send({data: userCreated})
}

module.exports.createUser = createUser
//module.exports.getDetails = getDetails
//module.exports.login = login