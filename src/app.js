import express from 'express';
import morgan from 'morgan';

import homeRouter from './routes/homeRouter';
import routes from "./routes";

const app = express();

//Middlewares
app.use(morgan("dev"));

//Middleware for routing
app.use(routes.HOME, homeRouter);

export default app;
