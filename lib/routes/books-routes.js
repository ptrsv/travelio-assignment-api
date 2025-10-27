const express = require("express");
const { getBooks, addBookToWishlist, getWishlist, resetWishlist, deleteFromWishlist } = require("../handler/book-handler");
const router = express.Router();

router.get('/list', getBooks)
router.post('/wishlist', addBookToWishlist)
router.get('/wishlist', getWishlist)
router.post('/reset-wishlist', resetWishlist)
router.delete('/wishlist/:title', deleteFromWishlist)

module.exports = router;