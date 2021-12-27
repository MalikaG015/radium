const getProducts=async function(req,res){
    try{
        let filter={isDeleted:false}
        const queryParams=req.query
        if (validator.isValidRequestBody(queryParams)){

          //const data = await productModel.find({title:{$regex:name ,$options:"$i"}})//.sort({ price})
            
            const { availableSizes, title, price } = queryParams;
        
            if(validator.isValid(availableSizes)){
            filter['availableSizes']=availableSizes
        }
            if(validator.isValid(title)){
            filter['title']=title
        }
        if(validator.isValid(price)){
          filter['price']=price
      }
        let greaterThanprice=req.query.greaterThanprice
        console.log(greaterThanprice)
        let lessThanprice=req.query.lessThanprice
        console.log(lessThanprice)
        if(greaterThanprice && lessThanprice){
          if(validator.isValid(greaterThanprice && lessThanprice)){
          //let allBooks= await BookModel.find({   $or: [{sales :12}, {isPublished :true }]    }).count() //or
            //const priceRange=await productModel.find({price:{$gte:greaterThanprice}},{price:{$lte:lessThanprice}},{isDeleted:false})
            const priceRange=await productModel.find({price:{$gte:greaterThanprice, $lte:lessThanprice}},{isDeleted:false})
            console.log(priceRange)
            //const priceRange=({price:{$gte:req.query.greaterThanprice}},{isDeleted:false})
            //console.log(priceRange)
            //filter['price']=priceRange
            filter['price']=priceRange
        }
        else{
          return res.status(400).send({ status: false, message: ' price not valid' })
        }
      }
if(greaterThanprice){
  if(validator.isValid(greaterThanprice)){
    const priceRange=await productModel.find({price:{$gte:greaterThanprice}},{isDeleted:false})
    console.log(priceRange)
    filter['price']=priceRange
}
  else{
    return res.status(400).send({ status: false, message: ' price not valid' })
   }
}
if(lessThanprice){
  if(validator.isValid(lessThanprice)){
    const priceRange=await productModel.find({price:{$lte:lessThanprice}},{isDeleted:false})
    console.log(priceRange)
    filter['price']=priceRange
  }
  else{
    return res.status(400).send({ status: false, message: ' price not valid' })
  }
}
}
    const data = await productModel.find( filter).sort({ price: 1 })
    //console.log(data)

        if (Array.isArray(data) && data.length === 0) {
            return res.status(404).send({ status: false, message: 'No data found' })
        }

        return res.status(200).send({ status: true, message: 'product lists', data: data })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const UpdateProductById = async function (req,res) {
  try{
      const productId=req.params.productId;
 
      let requestBody=req.body;
     
      if(!validator.isValidObjectId(productId))
      {
          return res.status(400).send({status:false,message:`invalid  Product Id`})
      }
      let filter={isDeleted:false,_id:productId}
      const product = await productModel.find(filter)
     
      if(!product)
      {
          return res.status(404).send({status:false,message:`product not Exist`})
      }
     if(!validator.isValidRequestBody(requestBody))
     {
      res.status(400).send({ status: false, message: 'No paramateres passed. product unmodified' })
      return 
     }
        // Extract params
    let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage,style,availableSizes,installments} = requestBody;
    //console.log(price)
    let tempObj={}
    if(validator.isValidString(title)){
         let istitlePresent= await productModel.findOne({title:requestBody.title})

      // console.log(istitlePresent)
          if(istitlePresent){
              return res.status(400).send({ status: false, message: `title is Already Present` });
          }
          
         tempObj['title']=title; 
     }

     if(validator.isValidString(description))
     {
         
      //console.log(description)
         tempObj['description']=description;
     }
     if(validator.isValidNumber(price))
     {
        // console.log(price)
          tempObj['price']=price
     }
     if(validator.isValidString(currencyId))
     {
         tempObj['currencyId']=currencyId
     }
     if(validator.isValidSymbol(currencyFormat))
     {
         tempObj['currencyFormat']=currencyFormat
     }
     if(validator.isValid(isFreeShipping))
     {
         tempObj['isFreeShipping']=isFreeShipping
     }
     
     let files = req.files;
     if (files && files.length > 0){
      let uploadedFileURL = await uploadFile(files[0]);
      //let uploadedFileURL = await awsObj.uploadFile(files[0]);
      //console.log("string1",uploadedFileURL)
      if(uploadedFileURL){
        //console.log("string2",uploadedFileURL)
        tempObj['productImage']=uploadedFileURL
      }
    } 
    if(validator.isValidString(style))
     {
         tempObj['style']=style;
     }
     
     //validation remaining
     const validSizes=availableSizes.filter(size=>{return validator.isValidAvailableSizes(size)} )
     if(validator.isValidString(validSizes))
     {
      tempObj['availableSizes']=validSizes;
     }
      if(validator.isValidString(installments))
     {
         tempObj['installments']=installments;
     }

     const updatedProductData = await productModel.findOneAndUpdate({ _id: productId },tempObj,{new:true})
     
     res.status(201).send({ status: true,message:`data upadated successfully`, data: updatedProductData })

  }
  catch(e)
  {
      return res.status(500).send({status:false,message:e.message})
  }
}