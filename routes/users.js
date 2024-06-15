const express = require("express");
const router = express.Router();
const { verifyTokenAdmin,verifyTokenAndAuthorization} = require("../middlewares/verifyToken");
const {getAllUser,getUserById,updateUserById,deleteUserById} = require ("../controllers/userController");

router.route("/:id")
      .put(verifyTokenAndAuthorization,updateUserById)
      .get(verifyTokenAndAuthorization,getUserById)
      .delete(verifyTokenAndAuthorization, deleteUserById);

router.get("/", verifyTokenAdmin, getAllUser);

module.exports = router;