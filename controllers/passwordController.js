const { User, validateChangePassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcryput = require("bcryptjs");
const nodemailer = require("nodemailer");


/**
* @desc Get Forgot Password View
* @route /password/forget-passowrd
* @method Get
* @access public
*/
module.exports.getForgetPasswordView = (req, res) => {
    try {
        res.render('forgot-password');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


/**
* @desc Send Forgot Password Link
* @route /password/forget-passowrd
* @method Post
* @access public
*/

module.exports.sendForgotPasswordLink = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const secret = process.env.JWT_SECRET_KEY + user.password;
        const token = jwt.sign({ email: user.email, id: user.id }, secret, {
            expiresIn: "10m"
        });//user have 10mins to change password

        const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;


        //TODO: send email to user

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            }
        });

        const maiilOptions = {
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: "Reset Password",
            html: `<div>
                 <h4>Click on the link to reset your password</h4>
                 <p>${link}</p>
                </div>`
        }

        transporter.sendMail(maiilOptions, function (error, success) {
            if (error) {
                console.log(error);
                res.status(500).json({message: "Something went wrong"});
            } else {
                console.log("Email send:" + success.response);
                res.render("link-send");
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};



/**
* @desc Get Reset Password View
* @route /password/reset-passowrd/:userId/:token
* @method Get
* @access public
*/

module.exports.getResetPasswordView = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const secret = process.env.JWT_SECRET_KEY + user.password;

        try {
            jwt.verify(req.params.token, secret);
            res.render('reset-password', { email: user.email });
        } catch (error) {
            console.log(error);
            res.json({ message: "Error" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


/**
* @desc  Reset Password The Password
* @route /password/reset-passowrd/:userId/:token
* @method Post
* @access public
*/

module.exports.resetThePassword = async (req, res) => {
    const { error} = validateChangePassword(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }
    
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const secret = process.env.JWT_SECRET_KEY + user.password;

        try {
            jwt.verify(req.params.token, secret);

            const salt = await bcryput.genSalt(10);
            req.body.password = await bcryput.hash(req.body.password, salt);
            user.password = req.body.password;

            await user.save();
            res.render('success-password');

        } catch (error) {
            console.log(error);
            res.json({ message: "Error" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};