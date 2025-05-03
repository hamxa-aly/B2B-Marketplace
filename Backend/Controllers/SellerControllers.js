const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const StoreModel = require("../Schemas/Store");
const SellerModel = require("../Schemas/Seller");
const userModel = require("../Schemas/users");
const OrderModel = require("../Schemas/Orders");

module.exports ={
    RegisterStore: async (req, res) => {
        const form = new formidable.IncomingForm();
        
        form.keepExtensions = true;
        form.uploadDir = path.join(__dirname, "../public/uploads/logos");
        form.maxFileSize = 10 * 1024 * 1024; // 10MB
    
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error!" });
            }
            console.log("Files:" , files);
    
            if (!files.logo) {
                console.log("Logo not found!");
                return res.status(400).json({ error: "Logo is required!" });
            }
    
            if (!fields.storeName) {
                console.log("storeName not found!");
                return res.status(400).json({ error: "Store name is not provided!" });
            }
    
            const seller = await SellerModel.findOne({AssociatedBuyerAccountEmail: req.user.userEmail});
            if (!seller) {
                return res.status(500).json({ error: "Internal Server Error!" });
            }
    
            const uploadedFile = files.logo[0];
            const customFilename = `${fields.storeName}-Logo${path.extname(uploadedFile.originalFilename)}`;
            const newPath = path.join(form.uploadDir, customFilename);
    
            fs.rename(uploadedFile.filepath, newPath, async (err) => {
                if (err) {
                    console.log("Error while uploading file: ", err);
                    return res.status(500).json({ error: "Failed to save logo!" });
                }
    
                console.log("File saved permanently!");
                let categories = [];
                if (typeof fields.category[0] === 'string' && fields.category[0].trim()) {
                    console.log("Category is a string.");
                    console.log("category: ", fields.category);
                    categories = fields.category[0].split(",").map(category => category.replace(' ','')).filter(category => /^[a-zA-Z\s]+$/.test(category));;
                }
                else{
                    console.log("category is not a string.");
                    console.log("category: ", fields.category);
                }
    
                // Create the store and save the logo URL
                const store = await StoreModel.create({
                    LogoURL: `/uploads/logos/${customFilename}`,
                    StoreOwner: seller._id,
                    StoreName: fields.storeName[0],
                    ProductCategories: categories
                });

                if(store){
                    const user = await userModel.findOne({ _id: req.user.userId });
                    if (!user) {
                        fs.stat(`../public${store.LogoURL}`, function(err,stats){
                            if(err)
                            {   console.log("File not found while deleting!");
                                return res.status(500);
                            }

                            fs.unlink(`../public${store.LogoURL}`, function(err){
                                if(err){
                                    console.log("Error Deleting file: " , err);
                                    return res.status(500);
                                }
                                console.log("File deleted successfully because of user not being found!");
                            })
                        })
                        StoreModel.findByIdAndDelete(store._id);
                        return res.status(404).json({ error: "User not found" });
                    }
                    user.StoreID = store._id;
                    await user.save();

                }
                return res.status(200).json({ message: "Store created successfully", store: store, storeStatus:true });
            });
        });
    },

    GetStoreId: async(req,res) => {

        try {
            const user = await userModel.findOne({_id: req.user.userId});
            if(!user){
                return res.status(500).json({error: "An error occured!"});
            }
            return res.status(200).json({storeID: user.StoreID.toString()});
        } 
        catch (error) {
            return res.status(500).json({error: "An error occured!"});
        }

    },

    GetOrders: async (req, res) => {
        try {
            const { storeId } = req.params;
            const orders = await OrderModel.find({ storeId }).populate("OrderItems.productId");
            console.log("Orders: ", orders);
            return res.status(200).json({ message: "Orders retrieved successfully", orders: orders });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while fetching orders" });
        }
    },

    CancelOrder: async (req, res) => {
        try {
            const { orderId } = req.params;
            const order = await OrderModel.findById(orderId);
            if (!order) return res.status(404).json({ message: "Order not found" });

            const orderAge = (new Date() - order.createdAt) / (1000 * 60 * 60 * 24);
            if (orderAge > 2) {
                return res.status(400).json({ message: "Order can only be cancelled within 2 days" });
            }

            await OrderModel.findByIdAndDelete(orderId);
            return res.status(200).json({ message: "Order cancelled successfully" });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while cancelling the order" });
        }
    },

    UpdateDeliveryTime: async (req, res) => {
        try {
            const { orderId } = req.params;
            const { newDeliveryDate } = req.body;
            
            const order = await OrderModel.findById(orderId);
            if (!order) return res.status(404).json({ message: "Order not found" });
            
            order.DeliveryDate = newDeliveryDate;
            await order.save();
            return res.status(200).json({ message: "Delivery date updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while updating the delivery time" });
        }
    },

    UpdateStatus: async (req, res) => {
        try {
            const { orderId } = req.params;
            const { newStatus } = req.body;
            
            const order = await OrderModel.findById(orderId);
            if (!order) return res.status(404).json({ message: "Order not found" });
            
            order.OrderStatus = newStatus;
            await order.save();
            return res.status(200).json({ message: "Order status updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while updating the order status" });
        }
    }
}