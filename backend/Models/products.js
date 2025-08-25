
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description : { type: String, required: true } , 
  inStock : { type: Boolean, default: true } ,
  createdAt : {type : Date , default : Date.now}

});
// ✅ Export it properly
const ProductModel = mongoose.model("Product", productSchema,'products');
module.exports = ProductModel;  


