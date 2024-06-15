const express = require("express");
const router = express.Router();
const {verifyTokenAdmin} = require("../middlewares/verifyToken");
const {getAllAuthors,getAuthorById,createAuthor,updateAuthor,deleteAuthor} = require("../controllers/authorController");


router.route("/")
.get(getAllAuthors)
.post(verifyTokenAdmin,createAuthor);

router.route("/:id")
      .get(getAuthorById)
      .delete(verifyTokenAdmin,deleteAuthor)
      .put(verifyTokenAdmin,updateAuthor);

      
module.exports = router;