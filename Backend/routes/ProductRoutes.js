const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductControllers");
const { authenticateToken, authorizeUser } = require("../middlewares/usersMiddlewares");

router.get("/getStoreProduts/:storeId", productController.GetProductsOfStore);

router.post("/AddProduct", productController.CreateProduct);

router.delete("/deleteProduct/:productId", productController.deleteProduct);

router.put("/updateProduct/:productId",productController.updateProduct);


module.exports = router;