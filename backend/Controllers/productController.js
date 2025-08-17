
const productModel = require("../Models/products");

/* // GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD a product
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; */



const getAllproducts = (req, res) => {
  const products = productModel.getAllproducts();
  res.status(200).json(products);
};
const getAllproductByid = (req, res) => {
    const id = parseInt(req.params.id)
    const product = productModel.getAllproductByid(id);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
};

const SearchProductByname = (req, res) => {
    const name = req.query.name; 

    if (!name) {
        return res.status(400).json({ message: "Query parameter 'name' is required" });
    }

    const product = productModel.SearchProductByname(name);
    if (product) {
        return res.status(200).json(product);
    } else {
        return res.status(404).json({ message: "Product not found" });
    }
};

const CreateProduct = (req, res) => {
    const { name, price, color } = req.body;

    // Optional: basic validation
    if (!name || !price || !color) {
        return res.status(400).json({ message: "Name, price, and color are required" });
    }

    const newProduct = productModel.CreateProduct( name, price, color );

    // Send success response
    res.status(201).json({
        message: "Product created successfully",
        product: newProduct+1
    });
    productModel.saveProducts();
};

const SearchProductBymaxpriceandminproce =(req,res)=>{
      const min=parseInt(req.params.min)
      const max=parseInt(req.params.max)
      if(!min || !max){
        res.status(404).json('the min and max items are required !')
      }
      else {
      const product = productModel.SearchProductBymaxpriceandminproce(min,max)
      res.status(200).json(product)
      }
}

const UpdateProductByid = (req,res)=>{
  const id = parseInt(req.params.id);
  const { name , price ,color } = req.body;
  if (!id || !name || !price){
    res.status(404).json('please enter the values you want to updated !')
  }
  else {
    const updatedItem = productModel.UpdateProductByid(id,name,price ,color)
    res.status(200).json( { message:'the values has been updated successfully : ', response:updatedItem})
    productModel.saveProducts();

  }
}

const deleteProductByid = (req,res)=>{
    const id=parseInt(req.params.id)
    if (!id){
        res.status(404).json('chef please enter the id !')
    }
    else {
       productModel.deleteProductByid(id)
       res.status(200).json ('the product has been deleted successfully ! ')
       productModel.saveProducts();

    }
}
module.exports = {
  getAllproducts,
  getAllproductByid,
  SearchProductByname,
  CreateProduct,
  SearchProductBymaxpriceandminproce,
  UpdateProductByid, 
  deleteProductByid
};
