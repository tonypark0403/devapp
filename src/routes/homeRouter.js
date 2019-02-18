import express from 'express';
import routes from ".";
const Router = express.Router();

Router.get(routes.HOME, (req, res) => res.send('Hello'));

export default Router;