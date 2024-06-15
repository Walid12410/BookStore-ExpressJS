const { Author, validateCreateAuthor, validateUpdateAuthor } = require("../models/Author");

/**
* @desc Show All Authors
* @route /api/authors
* @method Get
* @access public
*/
const getAllAuthors = async (req, res) => {
    try {
        const { pageNumber } =req.query;
        const autherPerPage = 2;
        let AuthorList;
        if(pageNumber){
             AuthorList = await Author
            .find()
            .skip((pageNumber -1) * autherPerPage)
            .limit(autherPerPage);     
        }else{
            AuthorList = await Author.find();
        }
        res.status(200).json(AuthorList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


/**
* @desc Get Author By ID
* @route /api/authors/:id
* @method Get
* @access public
*/
const getAuthorById = async (req, res) => {
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
};


/**
* @desc Create Author
* @route /api/authors/
* @method Post
* @access private (only admin)
*/
const createAuthor =async (req, res) => {
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
};


/**
* @desc Update Author
* @route /api/author/:id
* @method Put
* @access private (only admin)
*/
const updateAuthor = async (req, res) => {
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
};


/**
* @desc Delete a Author
* @route /api/authors/:id
* @method Delete
* @access private (only admin)
*/
const deleteAuthor = async (req, res) => {
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
};

module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
}