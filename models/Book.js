const mongoose = require("mongoose");
const Joi = require("joi");

const Bookschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    author: { // foreign key between author and book
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    cover: {
        type: String,
        required: true,
        trim: true,
        enum: ["soft cover", "hard cover"]
    }
}, { timestamps: true });

const Book = mongoose.model("Book", Bookschema);

// Validate Create Book 
function validateCreateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(200).required(),
        author: Joi.string().trim().required(),
        description: Joi.string().trim().min(3).max(500).required(),
        price: Joi.number().min(0).required(),
        cover: Joi.string().valid("soft cover", "hard cover").required()
    });
    return schema.validate(obj);
}

// Validate Update Book 
function validateUpdateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(200),
        author: Joi.string().trim(),
        description: Joi.string().trim().min(3).max(500),
        price: Joi.number().min(0),
        cover: Joi.string().valid("soft cover", "hard cover"),
    });
    return schema.validate(obj);
}

module.exports = {
    Book,
    validateCreateBook,
    validateUpdateBook
};
