import express from 'express';
import routes from "../";
const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests post route
// @access  Public
router.get(routes.USERS_URLs.TEST, (req, res) => res.json({
    msg: "Profile Works"
}));

export default router;