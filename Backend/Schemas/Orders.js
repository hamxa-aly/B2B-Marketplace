const { default: mongoose } = require("mongoose");
const db = require("../config/db");

const OrderSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    customerName: { type: String, required: true },
    DeliveryDate: { type: Date, required: true },
    OrderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    OrderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        Price: { type: mongoose.Schema.Types.Decimal128, required: true },
      },
    ],
    SubTotalPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
    ShippingPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
    TotalPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
  },
  { timestamps: true }
);

const orderModel = db.model("Order", OrderSchema);
module.exports = orderModel;
