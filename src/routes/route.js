const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')
const authorController = require('../controllers/authorController')
const loginController = require("../controllers/loginController")
const middleWare = require("../middleware/middleWare")


router.post('/authors', authorController.createAuthor);
router.post('/login', loginController.login);
router.post('/createblogs',middleWare.mid, blogController.createBlogs);
router.get('/blogs', middleWare.mid,blogController.getBlogs);
router.put('/blogs/:blogId',middleWare.mid, blogController.updateBlogs);
router.get('/delBlog/:blogId',middleWare.mid, blogController.deleteBlogByid);
router.get('/delBlogByQuery',middleWare.mid, blogController.deleteBlogByQueryCondition);



module.exports = router;