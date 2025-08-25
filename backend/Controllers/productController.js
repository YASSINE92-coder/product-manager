const ProductModel = require("../Models/products");
const pageSize = 5;
// ✅ Get all products
const getAllproducts = async (req, res) => {
  try {
    const products = await ProductModel.find().limit(pageSize).sort({name:1});
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
};
const calculeAvgPriceByStock = async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      { $match:{inStock :true}}, // filter only in-stock
      {
        $group: {
          _id: null, // we don’t group by a field, just all docs
          avgPrice: { $avg: "$price" }
        }
      }
    ]);
    res.status(200).json(products[0] || { avgPrice: 0 });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getProductInstock = async (req, res) => {
  try {
    const products = await ProductModel.find({inStock:true});
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get product by ID
const getAllproductByid = async (req, res) => {
  
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(400).json({ message: "Invalid product ID" });
  }
};

// ✅ Search by name
const SearchProductByname = async (req, res) => {
  try {
    const name = req.query.name || "";
    const products = await ProductModel.find({ name: new RegExp(name, "i") });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create product
const CreateProduct = async (req, res) => {
  try {
    const { name, price, description, inStock } = req.body; // match frontend fields

    // Simple validation
    if (!name || !description || price <= 0) {
      return res.status(400).json({ message: "All fields are required and price must be > 0" });
    }

    const newProduct = new ProductModel({ name, price, description, inStock });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Search by min/max price
const SearchProductBymaxpriceandminprice = async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);
    const products = await ProductModel.find({ price: { $gte: min, $lte: max } });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const SortByprice = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ price: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Update product by ID
const UpdateProductByid = async (req, res) => {
  try {
    const { name, price, description, inStock } = req.body; // destructure first

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { name, price, description, inStock }, // pass as update object
      { new: true, runValidators: true } // return updated doc and validate
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ✅ Delete product by ID
const deleteProductByid = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllproducts,
  getAllproductByid,
  SearchProductByname,
  CreateProduct,
  SearchProductBymaxpriceandminprice,
  UpdateProductByid,
  deleteProductByid,
  SortByprice,
  getProductInstock,
  calculeAvgPriceByStock
};
