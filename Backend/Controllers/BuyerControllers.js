const productModel = require("../Schemas/Prodcuts");
const cartModel = require("../Schemas/Cart");
const shippingModel = require("../Schemas/ShippingSchema");
const orderModel = require("../Schemas/Orders");
const mongoose = require("../config/db");

module.exports = {

    AddToCart: async (req, res) => {
        try {
            const { productID, quantity } = req.body;
    
            const product = await productModel.findById(productID);
            if (!product) {
                return res.status(404).json({ message: "Product not found!" });
            }
    
            // Find the user's cart or create a new one if not found
            let cart = await cartModel.findOne({ user: req.user.userId });
    
            if (!cart) {
                console.log("No cart found. Creating a new cart...");
                cart = new cartModel({ 
                    user: req.user.userId, 
                    products: [] 
                });
            }
    
            console.log("Cart ID: " + cart._id);
    
            // Check if product already exists in cart
            let productIndex = cart.products.findIndex(item => item.product.toString() === productID);
    
            if (productIndex === -1) {
                cart.products.push({ product: productID, quantity: quantity });
            } else {
                cart.products[productIndex].quantity += quantity;
            }
    
            await cart.save();
            return res.status(200).json({ message: "Product added to cart!" });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    },

    RemoveFromCart: async (req, res) => {
        try {
            const { productID } = req.body;
            const cart = await cartModel.findOne({ user: req.user.userId });
    
            if (!cart) {
                return res.status(404).json({ message: "Cart not found!" });
            }
            const productIndex = cart.products.findIndex((item) => item.product.toString() === productID);
            
            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found in cart!" });
            }
    
            cart.products.splice(productIndex, 1);
            await cart.save();
    
            return res.status(200).json({ message: "Product removed from cart!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    },

    IncrementCartItem: async (req, res) => {
        try {
            const { productID } = req.body;
            const cart = await cartModel.findOne({ user: req.user.userId }).populate("products.product");
    
            if (!cart) {
                return res.status(404).json({ message: "Cart not found!" });
            }
    
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productID);
            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found in cart!" });
            }
    
            const product = cart.products[productIndex].product;
    
            // Check if stock is available
            if (cart.products[productIndex].quantity >= product.Stock) {
                return res.status(400).json({ message: "Cannot increase quantity beyond available stock!" });
            }
    
            cart.products[productIndex].quantity += 1;
            await cart.save();
    
            return res.status(200).json({ message: "Product quantity increased!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    },

    DecrementCartItem: async (req, res) => {
        try {
            const { productID } = req.body;
            const cart = await cartModel.findOne({ user: req.user.userId }).populate("products.product");
    
            if (!cart) {
                return res.status(404).json({ message: "Cart not found!" });
            }
    
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productID);
            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found in cart!" });
            }
    
            const product = cart.products[productIndex].product;
    
            // Ensure quantity does not go below minimum order quantity
            if (cart.products[productIndex].quantity <= product.MinimumOrder) {
                return res.status(400).json({ message: `Cannot decrease below minimum order quantity (${product.MinimumOrder})!` });
            }
    
            cart.products[productIndex].quantity -= 1;
            await cart.save();
    
            return res.status(200).json({ message: "Product quantity decreased!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    },
        
    UpdateCart: async (req, res) => {
        try {
            const {productID, quantity} = req.body;
            const cart = cartModel.findOne({user: req.user.userId});
            let productIndex = -1;
            for (let i = 0; i < cart.products.length; i++) {
                if (cart.products[i].product == productID) {
                    productIndex = i;
                    break;
                }
            }
            if (productIndex == -1) {
                return res.status(404).json({message: "Product not found in cart!"});
            }
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return res.status(200).json({message: "Cart updated!"});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Internal Server Error!"});
        }
    },

    GetCart: async (req, res) => {
        try {
            const cart = await cartModel.findOne({ user: req.user.userId }).populate("products.product");
    
            if (!cart) {
                return res.status(200).json({ products: [] }); // Return an empty cart instead of null
            }
    
            return res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    },

    GetCheckoutAmountInclusiveOfDeliveryCharges: async (req, res) => {
        try {
            const cart = cartModel.findOne({user: req.user.userId}).populate("products.product");
            let amount = 0;
            for (let i = 0; i < cart.products.length; i++) {
                amount += cart.products[i].product.Price * cart.products[i].quantity;
            }
            return res.status(200).json({amount: amount + 100});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Internal Server Error!"});
    }},

    GetSingleProductCheckoutAmount: async (req, res) => {
        try {
            const {productID, quantity} = req.body;
            const product = await productModel.findById(productID);
            if (!product) {
                return res.status(404).json({message: "Product not found!"});
            }
            return res.status(200).json({amount: product.Price * quantity});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Internal Server Error!"});
        }
    },

    GetDeliveryCharges: async (req, res) => {
        return res.status(200).json({deliveryCharges: 100});
    },

    AddShippingAddress: async (req, res) => {
        try {
            const { fullName, phone, alternatePhone, street, city, state, zipCode, country, landmark, deliveryInstructions, isDefault } = req.body;
            const userId = req.user.userId;
            console.log("Adding Shipping address");
            if (isDefault) {
                // Ensure only one default address exists per user
                await shippingModel.updateMany({ user: userId }, { $set: { isDefault: false } });
            }
    
            const address = new shippingModel({
                user: userId,
                fullName,
                phone,
                alternatePhone,
                address: { street, city, state, zipCode, country },
                landmark,
                deliveryInstructions,
                isDefault
            });
    
            await address.save();
            console.log("Added Successfully!");
            return res.status(200).json({ message: "Address added successfully!", address });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    },

    UpdateShippingAddress: async (req, res) => {
        try {
            const { addressID, fullName, phone, alternatePhone, street, city, state, zipCode, country, landmark, deliveryInstructions, isDefault } = req.body;
            const userId = req.user.userId;
    
            // Ensure the address belongs to the user
            const address = await shippingModel.findOne({ _id: addressID, user: userId });
            if (!address) {
                return res.status(404).json({ message: "Address not found or access denied!" });
            }
    
            if (isDefault) {
                // Ensure only one default address exists
                await shippingModel.updateMany({ user: userId }, { $set: { isDefault: false } });
            }
    
            // Update the address fields correctly
            address.fullName = fullName;
            address.phone = phone;
            address.alternatePhone = alternatePhone;
            address.address.street = street;
            address.address.city = city;
            address.address.state = state;
            address.address.zipCode = zipCode;
            address.address.country = country;  // <-- Fix is here
            address.landmark = landmark;
            address.deliveryInstructions = deliveryInstructions;
            address.isDefault = isDefault;
    
            await address.save();
            return res.status(200).json({ message: "Address updated successfully!", address });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    },

    GetShippingAddresses: async (req, res) => {
        try {
            const userId = req.user.userId;
            const addresses = await shippingModel.find({ user: userId }).sort({ isDefault: -1 });
    
            if (!addresses.length) {
                return res.status(404).json({ message: "No shipping addresses found!" });
            }
    
            return res.status(200).json({ message: "Shipping addresses retrieved!", addresses });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    },
    
    PlaceOrder: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const cart = await cartModel.findOne({ user: req.user.userId }).populate("products.product");
            if (!cart || cart.products.length === 0) {
                console.log("cart is empty!");
                return res.status(400).json({ message: "Cart is empty!" });
            }

            const shippingAddress = await shippingModel.findOne({ user: req.user.userId});
            if (!shippingAddress) {
                console.log("No shipping address found!");
                return res.status(400).json({ message: "No default shipping address found!" });
            }

            const storeOrders = {};

            // Group products by store
            cart.products.forEach(cartItem => {
                const storeId = cartItem.product.Store.toString();
                if (!storeOrders[storeId]) {
                    storeOrders[storeId] = [];
                }
                storeOrders[storeId].push(cartItem);
            });

            const orderPromises = Object.keys(storeOrders).map(async storeId => {
                const orderItems = storeOrders[storeId].map(cartItem => ({
                    productId: cartItem.product._id,
                    quantity: cartItem.quantity,
                    Price: cartItem.product.Price
                }));

                // Check inventory and update it
                for (const item of orderItems) {
                    const product = await productModel.findById(item.productId).session(session);
                    if (product.quantity < item.quantity) {
                        throw new Error(`Insufficient quantity for product ${product.name}`);
                    }
                    product.quantity -= item.quantity;
                    await product.save({ session });
                }

                const subTotalPrice = orderItems.reduce((total, item) => total + item.Price * item.quantity, 0);
                const shippingPrice = 100; // Assuming a flat shipping rate
                const totalPrice = subTotalPrice + shippingPrice;

                const order = new orderModel({
                    storeId,
                    buyerId: req.user.userId,
                    customerName: shippingAddress.fullName,
                    DeliveryDate: new Date(), // Assuming immediate delivery for simplicity
                    OrderItems: orderItems,
                    SubTotalPrice: subTotalPrice,
                    ShippingPrice: shippingPrice,
                    TotalPrice: totalPrice
                });

                await order.save({ session });
                return order;
            });

            const orders = await Promise.all(orderPromises);

            // Clear the cart after placing the orders
            cart.products = [];
            await cart.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ message: "Orders placed successfully!", orders });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    }

}