const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');
const Auth = require('../middleware/Auth');

// ✅ Public routes (no Auth)
router.get('/', productController.getAllproducts);
router.get('/search', productController.SearchProductByname);

// ✅ Protected routes (with Auth)
router.get('/:min/:max', Auth, productController.SearchProductBymaxpriceandminprice); // must come BEFORE :id
router.get('/:id', Auth, productController.getAllproductByid);
router.post('/', Auth, productController.CreateProduct);
router.put('/:id', Auth, productController.UpdateProductByid);
router.delete('/:id', Auth, productController.deleteProductByid);

module.exports = router;
