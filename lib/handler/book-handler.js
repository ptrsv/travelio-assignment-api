const axios = require('axios');
const Joi = require('joi');
const db = require('../../db');
const pgp = require('pg-promise')();

const getBooks = async (req, res) => {
    const booksSchema = Joi.object({
        q: Joi.string().min(2).required()
    });

    const { error } = booksSchema.validate(req.query);
    if (error) {
        return res.status(400).json({ error: error.details.map((x) => x.message) });
    }

    try {
        const { query } = req;
        const books = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query.q}`);
        res.status(200).json(books.data);
    } catch (error) {
        console.log('Error fetching books:', error.message);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

const addBookToWishlist = async (req, res) => {
    const bookSchema = Joi.object({
        title: Joi.string().min(2).required(),
        authors: Joi.string().required(),
        thumbnail: Joi.string().uri().required(),
        rating: Joi.number().min(0).max(5).required(),
        ratings_count: Joi.number().min(0).required()
    });

    const { error } = bookSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map((x) => x.message) });
    }

    try {
        const { title, authors, thumbnail, rating, ratings_count } = req.body;

        console.log(pgp.as.format('INSERT INTO public.wishlist (title, authors, thumbnail, rating, ratings_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, authors, thumbnail, rating, ratings_count]))

        const result = await db.oneOrNone(
            'INSERT INTO public.wishlist (title, authors, thumbnail, rating, ratings_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, authors, thumbnail, rating, ratings_count]
        );

        res.status(200).json(result);
    } catch (error) {
        console.log('Error adding book to wishlist:', error.message);
        res.status(500).json({ error: 'Failed to add book to wishlist' });
    }
}

const getWishlist = async (req, res) => {
    try {
        const wishlist = await db.any('SELECT * FROM public.wishlist');
        res.status(200).json(wishlist);
    } catch (error) {
        console.log('Error fetching wishlist:', error.message);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
}

const resetWishlist = async (req, res) => {
    try {
        await db.none('DELETE FROM public.wishlist');
        res.status(200).json({ message: 'Wishlist has been reset' });
    } catch (error) {
        console.log('Error resetting wishlist:', error.message);
        res.status(500).json({ error: 'Failed to reset wishlist' });
    }
}

const deleteFromWishlist = async (req, res) => {
    const bookSchema = Joi.object({
        title: Joi.string().min(2).required()
    });

    const { error } = bookSchema.validate(req.params);
    if (error) {
        return res.status(400).json({ error: error.details.map((x) => x.message) });
    }

    try {
        const { title } = req.params;
        await db.none('DELETE FROM public.wishlist WHERE title = $1', [title]);
        res.status(200).json({ message: 'Book removed from wishlist' });
    }
    catch (error) {
        console.log('Error deleting book from wishlist:', error.message);
        res.status(500).json({ error: 'Failed to delete book from wishlist' });
    }
}

module.exports = {
    getBooks,
    addBookToWishlist,
    getWishlist,
    resetWishlist,
    deleteFromWishlist
};