const express = require('express');
const autocompleteController = require('../controllers/autocompleteController');

const router = express.Router();

router.get('/', autocompleteController.getSuggestions);

module.exports = router;