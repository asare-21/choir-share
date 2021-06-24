const bcrypt = require("bcryptjs");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { user } = require("./models/userMode");
const salt = 10;

passport.serializeUser((user, done) => {
  done(null, {
    name: user.name,
    id: user._id,
    email: user.email,
    phone: user.phone,
    location: user.location,
    approved: user.approved,
    uploads: user.uploads,
    admin: user.admin,
  });
});
passport.deserializeUser((id, done) => {
  user.findById(id, (err, result) => {
    done(err, result);
  });
});

//local strategy
passport.use(
  new localStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      // console.log(email, password);
      user.findOne({ email: email }, (err, result) => {
        console.log(result == null);
        if (!(result == null) || !(result == undefined)) {
          bcrypt.compare(password, result.password, (err, match) => {
            // console.log(match);
            if (err) throw err;
            if (match) {
              return done(null, result);
            } else {
              return done(null, false, {
                message: "Wrong Credentials",
              });
            }
          });
        } else {
          return done(null, false, {
            message: "Wrong Credentials",
          });
        }
      });
    }
  )
);

module.exports.passport = passport;
