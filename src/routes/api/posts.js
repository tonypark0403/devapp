import express from 'express';
import routes from "../";
const router = express.Router();

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get(routes.USERS_URLs.TEST, (req, res) => res.json({
    msg: "Posts Works"
}));

export default router;