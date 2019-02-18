import express from 'express';
import routes from ".";
const router = express.Router();

router.get(routes.HOME, (req, res) => res.send('Hello'));

export default router;