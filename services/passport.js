const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user,  done) => {
  //user.id -> id by mongo
  done(null, user.id);
});

//turn id into user instance and added to the req.user
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
})

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          //already have a record with the given profile id
          //null -> no err
          done(null, existingUser);
        } else {
          //save to the database
          new User({ googleId: profile.id })
            .save()
            .then((newUser) => { done(null, newUser);}
          );
        }
      })
  })
);

