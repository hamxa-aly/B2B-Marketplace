const express = require("express");
const {authenticateToken, authorizeUser, authenticatePasswordResetRequest} = require("../middlewares/usersMiddlewares");
const userControllers = require("../Controllers/UserController");
const buyerControllers =  require("../Controllers/BuyerControllers");
var router = express.Router();

router.post('/submitSignupForm', userControllers.Signup);

router.post('/login', userControllers.Login);

router.get("/profile", authenticateToken, authorizeUser("buyer"), userControllers.GetProfile);

router.post("/forgotPassword", userControllers.ForgotPasswordRequest);

router.get("/resetPassword/:userId/:resetToken", authenticatePasswordResetRequest, userControllers.ResetPassword);

router.post("/sellerRegistration" , authenticateToken, authorizeUser('buyer'), userControllers.RegisterAsSeller);

router.get("/sellerRegistrationStatus" , authenticateToken, authorizeUser("buyer"), userControllers.GetSellerAccountStatus)

router.get("/userRoleAndStoreStatus", authenticateToken, userControllers.GetUserRoleAndStoreStatus);

router.post("/AddtoCart", authenticateToken, buyerControllers.AddToCart);

router.get("/GetCart", authenticateToken, buyerControllers.GetCart);

router.delete("/RemoveFromCart", authenticateToken, buyerControllers.RemoveFromCart);

router.put("/IncrementCartItem", authenticateToken, buyerControllers.IncrementCartItem);

router.put("/DecrementCartItem", authenticateToken, buyerControllers.DecrementCartItem);

router.post("/AddShippingAddress", authenticateToken, buyerControllers.AddShippingAddress);

router.put("/UpdateShippingAddress", authenticateToken, buyerControllers.UpdateShippingAddress);

router.get("/GetShippingAddresses", authenticateToken, buyerControllers.GetShippingAddresses);

router.post("/placeOrder", authenticateToken, buyerControllers.PlaceOrder);

module.exports = router;
