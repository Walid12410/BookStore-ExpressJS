const express = require("express");
const router = express.Router();
const { verifyTokenAdmin } = require("../middlewares/verifyToken");
const {getAllBooks,getBookById,createBook,updateBook,deleteBook} = require("../controllers/bookController");

//api/books
router.route("/")
      .get(getAllBooks)
      .post(verifyTokenAdmin,createBook);

//api/books/:id
router.route("/:id")
      .get(getBookById)
      .put(verifyTokenAdmin,updateBook )
      .delete(verifyTokenAdmin, deleteBook);


module.exports = router;