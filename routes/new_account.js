const { Router } = require("express");
const router = Router();
// const user = require("../model/user-model");
const bcrypt = require("bcryptjs");
const salt = 10;

// validation
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
//
function validatePhone(phone) {
  const re = /\+233[0-9]{9}/;
  return re.test(phone);
}
//
function validateName(name) {
  const re = /^[a-zA-Z ]+$/;
  return re.test(name);
}
// renders the Account Creation Page
router.get("/", (req, res) => {
  res.render("new-account.ejs", { haserror: false, error: "" });
});
// Used to create a new user on the database
/*
1. Check for an already existing account
2. if an account with the same email address exists,
    return an error with ejs 
3. if no account exists, create a user and redeirect to the login page    
*/
//
router.post("/", (req, res) => {
  let userDetails;
  // create an account and rederiect to the login page
  if (validateEmail(req.body.email)) {
    if (validateName(req.body.name)) {
      if (validatePhone(req.body.phone)) {
        bcrypt.genSalt(salt, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            userDetails = {
              name: req.body.name,
              location: req.body.location,
              phone: req.body.phone,
              email: req.body.email,
              password: hash,
            };
            // creating a user in the database
            // user.findOne({ email: userDetails.email }, (err, result) => {
            //   // checking foz an existing user
            //   if (result == null) {
            //     res.redirect("/validate");
            //     user(userDetails).save();
            //   } else {
            //     res.render("new-account.ejs", {
            //       haserror: true,
            //       error: `An account with ${req.body.email} exists`,
            //     });
            //   }
            // });
          });
        });
      } else {
        return res.render("new-account.ejs", {
          haserror: true,
          error: "Please enter phone number in international format.",
        });
      }
    } else {
      return res.render("new-account.ejs", {
        haserror: true,
        error: "Invalid Name",
      });
    }
  } else {
    return res.render("new-account.ejs", {
      haserror: true,
      error: "Invalid Email",
    });
  }
});

// export the router
module.exports = router;
