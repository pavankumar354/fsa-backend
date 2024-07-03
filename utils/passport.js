const session = require("express-session");
const passport = require('passport');
const UserData = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const passportUtility = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
    })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: "http://localhost:8000/auth/google/callback",
                scope: ["profile", "email"]
            },
            (accessToken, refreshToken, profile, callback) => {
                // console.log(profile)
                callback(null, profile)
            }
        )
    );

    // passport.use(
    //     new GoogleStrategy(
    //         {
    //             clientID: process.env.CLIENT_ID,
    //             clientSecret: process.env.CLIENT_SECRET,
    //             callbackURL: "http://localhost:8000/auth/google/callback",
    //             scope: ["profile", "email"]
    //         },
    //         async (accessToken, refreshToken, profile, callback) => {
    //             // console.log(profile)
    //             try {
    //                 let user = await UserData.findOne({ googleId: profile.id });
    //                 console.log(user)
    //                 if (!user) {
    //                     user = new UserData({
    //                         googleId: profile.id,
    //                         email: profile.emails[0].value
    //                     });
    //                     await user.save();
    //                 }
    //                 return callback(null, user)
    //             } catch (error) {
    //                 return callback(error, null)
    //             }
    //         }
    //     )
    // );


    passport.serializeUser((user, done) => {
        // console.log(user)
        done(null, user);
        
    });
    
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
        
};


module.exports = passportUtility;