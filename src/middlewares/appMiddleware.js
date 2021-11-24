const jwt=require('jsonwebtoken')
const tokenCheck = function(req, res, next){
    let token=req.headers['x-auth-token']
    let validToken=jwt.verify(token,'radium')
    if(validToken){
        if(validToken._id==req.params.userId){
          next()

        }
        else{
            res.send({status:false, msg:"not authorized"}) 
        }
     }
    else{
        res.send({status:false, msg:"Invalid token"})
}
}

module.exports.tokenCheck = tokenCheck
