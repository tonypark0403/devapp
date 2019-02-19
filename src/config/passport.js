import JwtPassport from 'passport-jwt';
import mongoose from 'mongoose';
import keys from './keys';

// const User = mongoose.model('users');
import User from '../models/User';
const JwtStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

export default passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if(user) {
                    return done(null, user); // null => error
                }
                return done(null, false);
            })
            .catch(err => console.err(err));
    }));
};