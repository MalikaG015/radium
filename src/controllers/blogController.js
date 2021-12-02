const AuthorModel = require("../models/authorModel")


const blogModel = require("../models/blogModel")

const mongoose = require("mongoose")

const createBlogs= async function(req, res) {
  try {
    let data = req.body
    if (!(req.body.tokenId===data.authorId)) {
        return res.send("not authorized")
    } else {
        if (data.isPublished == true) {
            data["publishedAt"] = new Date();
        }
        let authorId = data.authorId
        let authorReq = await AuthorModel.findById(authorId)
        if (!authorReq) {
          return res.status(400).send({ status: false, msg: `${authorId} is not available, please enter valid authorId` })
        }
            let createBlog = await blogModel.create(data)
            res.status(201).send({ status: true, data: createBlog })
         }
} catch (error) {
    res.status(500).send({ status: false, message:error })
}
}
    
    
    

const getBlogs=async function(req,res){
    try{
      let filter={isDeleted:false, isPublished:true}
      if(req.query.authorId){
      filter['authorId']=req.query.authorId
      }
    if(req.query.category){
      filter["category"]=req.query.category
    }
    if(req.query.tags){
      filter["tags"]=req.query.tags

    }
    if(req.query.subCategory){
      filter["subCategory"]=req.query.subCategory
      }

      let result=await blogModel.find(filter) 
      if(result.length>0){
    
    res.status(200).send({ status: true, data: result })
}
else{
    res.status(404).send({status:false, msg:"No data found"})
  }
}

catch(error){
    res.status(404).send({msg:"error-response-status"})
    }
}

const updateBlogs=async function(req,res){
  try {
    const data = await blogModel.findById(req.params.blogId)
    
    if (!(data.authorId == req.body.tokenId)) {
      return res.status(400).send({ status: false, msg: "unauthorized access" })
    }
    if (!data) {
      return res.status(404).send({ msg: "data not found" });
    }
    let data1 = await blogModel.findOneAndUpdate({ _id: req.params.blogId }, { title: req.body.title, body: req.body.body, tags: req.body.tags, subCategory: req.body.subCategory, PublishedAt: Date(), isPublished: true })
    res.status(200).send({ msg: "successfully updated", data: data1 });
  }
  catch (error) {
    res.status(404).send({ status: false, msg: "error-response-status" });
  }
}
//(5th api) that is my fifth api to delete a data which blog id is given
const deleteBlogByid = async function (req, res) {
  try {
    let check = await blogModel.findOne({ _id: req.params.blogId, isDeleted: false });
    if (!check) {
      return res.status(404).send({ status: false, msg: "blog dosnt exist" });
    }
    if ((req.body.tokenId == check.authorId)) {
      await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted: false }, { isDeleted: true, deletedAt: Date() });
      res.status(200).send({ status: true, msg: "sucessfully deleted" });
    } else {
      res.status(400).send({ status: false, msg: "unauthorized access" })
    }
  } catch (error) {
    res.status(400).send({ status: false, msg: error });
  }
}
// (6th api)last api to delete a blog by search givin condition i that api
//  i can use or condition to find the data and 
// in updatemany i can use the same condition
const deleteBlogByQueryCondition = async function (req, res) {
  
  try {
    if(Object.keys(req.query).length===0){
      return res.status(400).send({status:false,msg:"provide query parameter"})
    }
    let check = await blogModel.find({ $or: [{ authorId: req.query.authorid }, { tags: req.query.tag }, { subcategory: req.query.subcategory },{isPublished: req.query.isPublished}] });
    if (!check) {
      return res.status(400).send({ status: false, msg: "No blog found" });
    }
    await blogModel.updateMany({ $or: [{ authorId: req.query.authorid }, { tags: req.query.tag }, { subcategory: req.query.subcategory },{isPublished: req.query.isPublished}] }, { isDeleted: true });
    res.status(200).send({ status: true, msg: "sucessfully deleted" });
  } catch (error) {
    res.status(400).send({ status: false, msg: error });
  }
}

module.exports.createBlogs=createBlogs
module.exports.updateBlogs=updateBlogs
module.exports.getBlogs=getBlogs
module.exports.deleteBlogByid=deleteBlogByid
module.exports.deleteBlogByQueryCondition=deleteBlogByQueryCondition

/*let blogId=req.params.blogId
    let newTitle=req.body.title
    let newBody=req.body.body
    let newTags=req.body.tags
    let newSubCategory=req.body.subCategory

    const thisDelete= async function(req,res){
      try{
      let blogId=req.params.blogId
      let data=await blogModel.find({_id:blogId,isDeleted:false})
        if(!data){
          res.status(401).send({status:false,msg:"Blogid does not exists"})
         }
         let data1=await blogModel.findById({_id:blogId})
         req.body.deletedAt=Date()
         req.body.isDeleted=true
         res.status(200).send({status:true,msg:data1})
        
      }
        catch(error){
          res.status(500).send({status:false,msg:"error response"})
        }
    }
    module.exports.thisDelete=thisDelete*/

    /*const createBlog=async function(req,res){
      authorId1=req.body.authorId
      let response=await AuthorModel.findById(authorId1)
      if(!response){
        return res.status(400).send({status:"false",msg:"not a valid author id"})
      }
      //creating blog for a particular author first time
      let data=req.body
      let blogCreated=await blogModel.create(data)
      req.body['isPublished']:true
      req.body['publishedAt']:Date()
      res.status(200).send({msg:"successfully blog created",data:blogCreated})


    }
    */
