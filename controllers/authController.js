const { User, validateRegistorUser, validateLoginUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
* @desc Register New User
* @route /api/auth/register
* @method Post
* @access public
*/

const register = async (req, res) => {
    const { error } = validateRegistorUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "This user already registered" });
    }

    //hash password library called bcryptjs
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    try {
        user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        });

        const result = await user.save();
        // Create a JWT token (you need to define your secret key in your environment variables)
        // const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, {
        //     expiresIn: "4m"
        // });

        //calling method
        const token = user.generateToken();
        //user.generate
        const { password, ...other } = result._doc;
        res.status(201).json({ ...other, token });

    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
};

/**
* @desc Login User
* @route /api/auth/login
* @method Post
* @access public
*/

const login =  async (req, res) => {
    try {
        const { error } = validateLoginUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "invalid email or password" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create a JWT token (you need to define your secret key in your environment variables)

        // const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, {
        //     expiresIn: "1h"
        // });


        //calling method
        const token = user.generateToken();

        const { password, ...other } = user._doc;

        res.status(200).json({ user: { ...other }, token: { token } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login
}