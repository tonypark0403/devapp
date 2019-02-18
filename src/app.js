import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

import homeRouter from './routes/homeRouter';
import routes from "./routes";
import dbKey from './config/keys';

const app = express();

//DB Config
const db = dbKey.mongoURI;

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//Middlewares
app.use(morgan("dev"));

//Middleware for routing
app.use(routes.HOME, homeRouter);

export default app;
