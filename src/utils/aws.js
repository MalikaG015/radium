const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
  secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
  region: "ap-south-1" // Mumbai region
});

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
      // exactly
  
      // Create S3 service object
      let s3 = new S3({ apiVersion: "2006-03-01" });
      var uploadParams = {
        ACL: "public-read", // this file is publically readable
        Bucket: "classroom-training-bucket", // HERE
        Key: "group2/project-5/" + file.originalname, // HERE    "group2/project-5/profileImage.png"
        Body: file.buffer,
      };
  
      // Callback - function provided as the second parameter ( most oftenly)
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          return reject({ error: err });
        }
        console.log(data);
        console.log(`File uploaded successfully. ${data.Location}`);
        return resolve(data.Location); //HERE
      });
    });
  };
  module.exports={
      uploadFile
  }