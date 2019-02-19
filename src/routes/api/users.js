import express from 'express';
import routes from "../";
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load User model
import User from '../../models/User';
import keys from '../../config/keys';
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get(routes.USERS_URLs.TEST, (req, res) => res.json({
    msg: "Users Works"
}));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(routes.USERS_URLs.REGISTER, (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                return res.status(400).json({
                    email: 'Email already exists'
                })
            } else {
                const { name, email, password} = req.body;
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                })
                const newUser = new User({
                    name,
                    email,
                    avatar,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.error(err));
                    });
                });
            }
        });
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    //Find user by email
    User.findOne({
        email
    }).then(user => {
        //Check for user
        if(!user) return res.status(404).json({email: 'User not found'});
        //Check Password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch) {
                    // res.json({
                    //     msg: 'Success'
                    // });
                    // User Matched

                    // Create JWT Payload
                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    }
                    //Sign Token
                    jwt.sign(
                        payload, 
                        keys.secretOrKey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        }); //one hour(60 * 60)
                } else {
                    return res.status(404).json({
                        password: 'Password incorrect'
                    });
                }
            });
    });
});

export default router;