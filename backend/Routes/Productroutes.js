const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

router.get('/', productController.getAllproducts);
router.get('/search', productController.SearchProductByname);
router.get('/:id', productController.getAllproductByid);
router.post('/', productController.CreateProduct);
router.get('/:min/:max', productController.SearchProductBymaxpriceandminproce);
router.put('/:id', productController.UpdateProductByid);
router.delete('/:id', productController.deleteProductByid);
module.exports = router;
 