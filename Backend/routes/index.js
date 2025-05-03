var express = require('express');
const userModel = require("../Schemas/users");
var router = express.Router();
const productController = require("../Controllers/ProductControllers");


router.get("/getImage:path", productController.GetProductImage);

router.get("/:timeStamp",productController.GetAllProducts);

module.exports = router;
