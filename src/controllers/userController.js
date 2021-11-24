const userModel = require('../models/userModel')
const jwt=require('jsonwebtoken')

const createUser = async function (req, res) {
    let userDetails = req.body
    let userCreated = await userModel.create(userDetails)
    res.send({data: userCreated})
}
const loginUser=async function(req,res){
    if(req.body && req.body.userName && req.body.password){
        let user=await userModel.findOne({name:req.body.userName, password:req.body.password, isdeleted:false})
        if(user){
            let payload={_id:user._id,name:user.name}
            let token=jwt.sign(payload,'radium')
            res.header('x-auth-token',token)
            res.send({status:true})
        }
        else{
            res.send({status:false, msg:"Inavalid username or password"})
        }
  }
    else{
        res.send({status:false, msg:"Request body must contain username as well as password"})
    }
    
}
const giveUserDetails=async function(req,res){
    if(req.validToken._id==req.params.userId){
            let user=await userModel.findOne({_id:req.params.userId, isDeleted:false})
            if(user){
                res.send({status:true, data:user})

            }
            else{
                res.send({status:false,msg:"user not found"})
            }

        }
        else{
            res.send({status:false, msg:"not authorized"})
        }
    }
const updateUserDetails=async function(req,res){
    if(req.validToken._id==req.params.userId){
            let userDetails=await userModel.findOneAndUpdate({_id:req.params.userId},{email:req.body.email},{new:true})
            if(userDetails){
                res.send({status:true, data:userDetails})
             }
            else{
                res.send({status:false,msg:"user not found"})
            }
        }
        else{
            res.send({status:false, msg:"not authorized"})
         }
       }

module.exports.createUser = createUser
module.exports.loginUser = loginUser
module.exports.giveUserDetails = giveUserDetails
module.exports.updateUserDetails = updateUserDetails
