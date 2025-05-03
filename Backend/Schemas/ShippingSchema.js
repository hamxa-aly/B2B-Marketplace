const db = require("../config/db");

const ShippingSchema = new db.Schema({
    user: { type: db.Schema.Types.ObjectId, ref: "user", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String }, // Optional
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: "Pakistan" }
    },
    landmark: { type: String }, // Optional (e.g., "Near the mall")
    deliveryInstructions: { type: String }, // Optional (e.g., "Leave at the door")
    isDefault: { type: Boolean, default: false }, // To mark default shipping address
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = db.model("Shipping", ShippingSchema);