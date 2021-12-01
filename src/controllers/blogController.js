const AuthorModel = require("../models/authorModel")


const blogModel = require("../models/blogModel")

const mongoose = require("mongoose")

const createBlogs= async function(req, res) {
    try{
        let authorId=req.body.authorId
        //let date=Date()
        //let data=req.body
    
        let Author= await AuthorModel.findById(authorId)
        if(Author)
        {
          let date=Date()
            req.body.publishedAt=date
            req.body.isPublished=true
            let createdBlog=await blogModel.create(req.body)
            res.status(201).send({status:true, data:createdBlog})
        }
        else
        {
           res.status(400).send({status:false,msg:"Author id not found"})
        }
    }catch(error){
        res.status(500).send({status:false, msg:error});
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
    try{
    let blogId=req.params.blogId
    let newTitle=req.body.title
    let newBody=req.body.body
    let newTags=req.body.tags
    let newSubCategory=req.body.subCategory
    let today=Date();
    let data=await blogModel.find({_id:blogId})
    if(data){
    let data1=await blogModel.findOneAndUpdate({_id:blogId},{title:newTitle,body:newBody,tags:newTags,subCategory:newSubCategory,isPublishedAt:today, isPublished:true})
    res.status(200).send({msg:"successfully updated",data:data1})
    }
    else{
        res.status(400).send({msg:"data not found"})
    }
    
}
catch(error){
    res.send(404).status({status:false,msg:"error-response-status"})
}
}
//(5th api) that is my fifth api to delete a data which blog id is given
const deleteBlogByid = async function (req, res) {
  const blogId = req.params.blogId
  let currentDate = Date()
  try {
    let check = await blogModel.findOne({ _id: blogId, isDeleted: false });
    if (check) {
      await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: currentDate });

      res.status(200).send({ status: true, msg: "sucessfully deleted" });
    } else {
      res.status(404).send({ status: false, msg: "blog dosnt exist" });
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
    let authorid = req.query.authorid;
    let tag = req.query.tag;
    let subcategory = req.query.subcategory;
    let isPublished = req.query.isPublished;
    let check = await blogModel.find({ $or: [{ authorId: authorid }, { tags: [tag] }, { subcategory: [subcategory] }, { isPublished: isPublished }] });
    if (check) {
      await blogModel.updateMany({ $or: [{ authorId: authorid }, { tags: [tag] }, { subcategory: [subcategory] }, { isPublished: isPublished }] }, { isDeleted: true });

      res.status(200).send({ status: true, msg: "sucessfully deleted" });
    } else {
      res.ststus(400).send({ status: false, msg: "!No blog found" });
    }
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
