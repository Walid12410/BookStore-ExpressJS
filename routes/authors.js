const express = require("express");
const router = express.Router();
const { Author, validateCreateAuthor, validateUpdateAuthor } = require("../models/Author");
const {verifyTokenAdmin} = require("../middlewares/verifyToken");


/**
* @desc Show All Authors
* @route /api/authors
* @method Get
* @access public
*/
router.get("/", async (req, res) => {
    try {
        const AuthorList = await Author.find(); // find method give you all database of author
        //.sort({ firstName: 1 }).select("firstName lastName ") can add to sort the database and select
        res.status(200).json(AuthorList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


/**
* @desc Get Author By ID
* @route /api/authors/:id
* @method Get
* @access public
*/
router.get("/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (author) {
            res.status(200).json(author);
        } else {
            res.status(404).json({ message: "Author Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


/**
* @desc Delete a Author
* @route /api/authors/:id
* @method Delete
* @access private (only admin)
*/
router.delete("/:id",verifyTokenAdmin, async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (author) {
            await Author.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Authoe Has Been Deleted" });
        } else {
            res.status(404).json({ message: "Author Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


/**
* @desc Update Author
* @route /api/author/:id
* @method Put
* @access private (only admin)
*/
router.put("/:id",verifyTokenAdmin, async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);

    if (error) {
        res.status(400).json({ message: error.details[0].message });
    }
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                nationality: req.body.nationality,
                image: req.body.image
            }
        }, { new: true }); // new:true give you the update author that you update

        res.status(200).json(author);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


/**
* @desc Create Author
* @route /api/authors/
* @method Post
* @access private (only admin)
*/
router.post("/",verifyTokenAdmin, async (req, res) => {

    const { error } = validateCreateAuthor(req.body);

    if (error) {
        res.status(400).json({ message: error.details[0].message });
    }


    try {
        const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image
        });
        const result = await author.save();
        res.status(201).json(result); // 201 mean create successfully
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message }); // 500 mean error went from server
    }
});




module.exports = router;