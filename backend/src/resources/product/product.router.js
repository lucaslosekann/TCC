const express = require('express');
const { protect, protectAdmin } = require('../../utils/auth');
const { getMany, createOne, getOne, updateOne, removeOne } = require('./product.controller');
const router = express.Router();


// /api/product/
router.route('/')
  .get(getMany)
  .post([protect, protectAdmin], createOne)

// /api/product/:id
router.route('/:id')  
  .get(getOne)
  .put([protect, protectAdmin], updateOne)
  .delete([protect, protectAdmin], removeOne)
 
module.exports = router;
