import express from 'express';
import routes from "../";
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get(routes.TEST, (req, res) => res.json({
    msg: "Users Works"
}));

export default router;