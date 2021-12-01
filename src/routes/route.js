const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')
const authorController = require('../controllers/authorController')


router.post('/authors', authorController.createAuthor);
router.post('/blogs', blogController.createBlogs);
router.get('/blogs', blogController.getBlogs);
router.put('/blogs/:blogId', blogController.updateBlogs);
router.get('/delBlog/:blogId', blogController.deleteBlogByid);
router.get('/delBlogByQuery', blogController.deleteBlogByQueryCondition);
//router.get('/delBlog/:blogId', blogController.thisDelete);


module.exports = router;