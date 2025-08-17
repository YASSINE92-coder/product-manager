
const products = require("../products.json");
const fs =require('fs')

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  color: String,
});

module.exports = mongoose.model("products", productSchema);


function saveProducts(){
  const data = JSON.stringify(products, null, 2);
  fs.writeFileSync('products.json', data, 'utf8');
  console.log('Data saved to products.json');

}
function getAllproducts(){
  return products;
}
function getAllproductByid(id){
    return products.find(product => product.id === id);
}
function SearchProductByname(name) {
    return products.filter(product => 
        product.name.toLowerCase().includes(name.toLowerCase().trim())
    );
}
function CreateProduct(name,price,color){
   const newId = products.length > 0 
    ? Math.max(...products.map(p => p.id)) + 1 
    : 1;
    const newproduct = { id:newId ,name , price , color}
    return products.push(newproduct)
}
function SearchProductBymaxpriceandminproce(min,max){
    return products.filter(product => product.price >= min && product.price <= max)
}
function deleteProductByid (id){
    const foundedproduct= products.findIndex (product => id === product.id)
    if(foundedproduct !== -1){
      products.splice(foundedproduct ,1)
      return true
    }
 return false
}
function UpdateProductByid (id ,name , price ,color) {
    const foundedproduct = products.findIndex( product => id === product.id)
   if (foundedproduct !== -1) {
    // Merge old product with updated values
    products[foundedproduct] = {
      ...products[foundedproduct],
      name,
      price,
      color
    };
    return products[foundedproduct]; // return the updated product
  }
  return null
}
module.exports = {
  getAllproducts,
  getAllproductByid,
  SearchProductByname,
  CreateProduct,
  SearchProductBymaxpriceandminproce,
  deleteProductByid,
  UpdateProductByid,
  saveProducts
}