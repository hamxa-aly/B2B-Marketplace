const db = require("../config/db");

const CartScehma =  db.Schema({
    user: {type: db.Schema.Types.ObjectId, ref: "User", required: true},
    products: [{product: {type: db.Schema.Types.ObjectId, ref: "Product", required: true}, 
        quantity: {type: Number, required: true}}],
},
{ timestamps: true });

module.exports = db.model("Cart", CartScehma);