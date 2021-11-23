const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
//const productController = require('../controllers/productController')
//const orderController = require('../controllers/orderController')
//const appMiddleware = require('../middlewares/appMiddleware')

router.post('/users', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/users/:userId', userController.giveUserDetails);
router.put('/users/:userId', userController.updateUserDetails);

module.exports = router;