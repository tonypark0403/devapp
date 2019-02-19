import express from 'express';
import routes from "../";
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

// Load Input Validation
import validateRegisterInput from '../../validation/register';
import validateLoginInput from '../../validation/login';

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
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
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
router.post(routes.USERS_URLs.LOGIN, (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const { email, password } = req.body;

    // Find user by email
    User.findOne({
        email
    }).then(user => {
        // Check for user
        if(!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }
        // Check Password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch) {
                    // Create JWT Payload
                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    }
                    // Sign Token
                    jwt.sign(
                        payload, 
                        keys.secretOrKey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        }); // one hour(60 * 60)
                } else {
                    errors.password = 'Password incorrect';
                    return res.status(404).json(errors);
                }
            });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(routes.USERS_URLs.CURRENT, passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id, name, email } = req.user;
    res.json({
        id,
        name,
        email
    })
});

export default router;