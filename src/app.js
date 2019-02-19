import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import localStrategy from './config/passport';

import dbKey from './config/keys';
import routes from "./routes";
import homeRouter from './routes/homeRouter';
import users from './routes/api/users';
import posts from './routes/api/posts';
import profile from './routes/api/profile';

const app = express();

// Middlewares
app.use(morgan("dev"));
// Body parser middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = dbKey.mongoURI;

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport Config
localStrategy(passport);

// Middleware for routing
app.use(routes.USERS, users);
app.use(routes.POSTS, posts);
app.use(routes.PROFILE, profile);

export default app;
