//const BookModel= require('../models/bookModel')
const AuthorModel= require('../models/authorModel')

const createAuthor= async function (req, res) {
    var data= req.body
    //let author_id-=req.body.author;
    let authorCreated= await AuthorModel.create(data)
    res.send({data: authorCreated})    
}

/*const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}*/

module.exports.createAuthor= createAuthor
