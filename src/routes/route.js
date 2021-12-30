const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
  secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
  region: "ap-south-1" // Mumbai region
});


const UserController = require('../controllers/userController')
const ProductController = require('../controllers/productController')
const CartController = require('../controllers/cartController')
const OrderController = require('../controllers/orderController')

//const {userController,productController}=require('../controllers)
const {authMiddleware} = require('../middlewares')

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});
//----------feature-1(user api)-----------------------------------------------
router.post("/register", UserController.registerUser)
router.post("/login",UserController.loginUser)
router.get('/user/:userId/profile', authMiddleware, UserController.getUserProfile)
router.put('/user/:userId/profile', authMiddleware, UserController.updateUser1)

//----------feature-2(product api)--------------------------------------------
router.post("/products",ProductController.createProduct)
router.get("/products",ProductController.getProducts)
router.get("/products/:productId",ProductController.getProductById)
router.put("/products/:productId",ProductController.UpdateProductById)
router.delete("/products/:productId",ProductController.deleteProduct)

//----------feature-3(cart api)------------------------------------------------
router.post("/users/:userId/cart",authMiddleware,CartController.createCart)
router.put("/users/:userId/cart",authMiddleware,CartController.updateCart)
router.get("/users/:userId/cart",authMiddleware,CartController.getCart)
router.delete("/users/:userId/cart",authMiddleware,CartController.deleteCart)

//-----------feature-4(orders api)----------------------------------------------
router.post("/users/:userId/orders",authMiddleware, OrderController.createOrder)
router.put("/users/:userId/orders", authMiddleware,OrderController.updateOrderStatus)




module.exports = router;