const express = require('express');
const { protect, protectAdmin } = require('../../utils/auth');
const { getById, uploadMany } = require('./image.controller')
const router = express.Router();


// /api/images/:id
router.route('/:id')
  .get(getById)
router.route('/')
  .post([protect, protectAdmin], uploadMany)

 
module.exports = router;
