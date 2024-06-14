const express = require("express");
const router = express.Router();
const { Book, validateCreateBook, validateUpdateBook } = require("../models/Book");
const {verifyTokenAdmin} = require("../middlewares/verifyToken");


/**
* @desc Get All Book
* @route /api/books
* @method Get
* @access public
*/

router.get("/", async (req, res) => {
    try {
        const BookList = await Book.find().populate("author",["_id","firstName","lastName"]);
        //.sort({ firstName: 1 }).select("firstName lastName ") can add to sort the database and select
        //populate method give you author details instead of author id only.
        res.status(200).json(BookList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

/**
* @desc Get Book By ID
* @route /api/books/:id
* @method Get
* @access public
*/
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("author");
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

});

/**
* @desc Create New Books
* @route /api/books
* @method Post
* @access private (only admin)
*/
router.post("/",verifyTokenAdmin, async (req, res) => {

    const { error } = validateCreateBook(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message }); // 400 mean req . from client
    }

    try {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover
        });
        const result = await book.save();
        res.status(201).json(result); // 201 mean created successfully 

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
    
});


/**
* @desc Update a book
* @route /api/books/:id
* @method Put
* @access private (only admin)
*/
router.put("/:id",verifyTokenAdmin, async (req, res) => {
    const { error } = validateUpdateBook(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const book = await Book.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                price: req.body.price,
                cover: req.body.cover
            }
        }, { new: true });
        if (book) {
            res.status(200).json({ message: "Book Has Been Updated" });
        } else {
            res.status(404).json({ message: "Books Not Found" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

/**
* @desc Delete a Book
* @route /api/books/:id
* @method Delete
* @access private (only admin)
*/
router.delete("/:id",verifyTokenAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (book) {
            await Book.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Book Has Been Deleted" });
        } else {
            res.status(404).json({ message: "Books Not Found" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;