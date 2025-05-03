const express = require("express");
const { authenticateToken, authorizeUser } = require("../middlewares/usersMiddlewares");
const router = express.Router();
const sellerControllers = require("../Controllers/SellerControllers");

const ROLE_ALLOWED = "seller";

router.post("/createstore", sellerControllers.RegisterStore);

router.get("/GetStoreId", sellerControllers.GetStoreId);

router.get("/GetOrders/:storeId", sellerControllers.GetOrders);

router.delete("/CancelOrder/:orderId", sellerControllers.CancelOrder);

router.put("/UpdateOrderStatus/:orderId", sellerControllers.UpdateStatus);

router.put("/UpdateDeliveryDate/:orderId", sellerControllers.UpdateDeliveryTime);

module.exports = router;