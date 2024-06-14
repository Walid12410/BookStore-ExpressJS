const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, validateUpateUser } = require("../models/User");
const { verifyTokenAdmin,verifyTokenAndAuthorization } = require("../middlewares/verifyToken");


//protected route : means route protect by token , without token this is not protected

/**
* @desc Update User
* @route /api/users/:id
* @method PUT
* @access private
*/
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { error } = validateUpateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
            }
        }, { new: true }).select("-password");
        res.status(200).json(updateUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

/**
* @desc Get All User
* @route /api/users/
* @method Get
* @access private (only admin)
*/
router.get("/", verifyTokenAdmin, async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
});

/**
* @desc Get All User By Id
* @route /api/users/:id
* @method Get
* @access private (only admin & user himeself)
*/
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({message: "User Not Found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.details[0].message});
    }
});

/**
* @desc Delete User By Id
* @route /api/users/:id
* @method Delete
* @access private (only admin & user himeself)
*/
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if(user){
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message : "User has been deleted successfully"});
    }else{
        res.status(404).json({message: "User Not Found"});
    }
});


module.exports = router;