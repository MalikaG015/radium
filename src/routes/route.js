const express = require('express');
const router = express.Router();

const weatherController= require("../controllers/weatherController")

router.get("/Location", weatherController.getWeather)
router.get("/LondonTemp", weatherController.getLondonTemp)
router.post("/tempSort", weatherController.tempSort)




module.exports = router;