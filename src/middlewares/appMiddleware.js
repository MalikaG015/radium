const jwt=require('jsonwebtoken')
const tokenCheck = function(req, res, next){
    let token=req.headers['x-auth-token']
    let validToken=jwt.verify(token,'radium')
    if(validToken){
     req.validToken=validToken
     next()
    }
    else{
        res.send({status:false, msg:"Invalid token"})

    }

}

module.exports.tokenCheck = tokenCheck
