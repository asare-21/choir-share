const express = require("express");
const app = express();
const loginRoute = require("./routes/login");
const new_account = require("./routes/new_account");
const homeRoute = require("./routes/home");
const uploads = require("./routes/uploads");
const path = require("path");
const session = require("express-session");
const contentful_management = require("contentful-management");
const contentful = require("contentful");
const { passport } = require("./passport-config");
const error = require("./routes/404");
require("dotenv").config();

//middlewares
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: Date.now().toString(),
    saveUninitialized: false,
    resave: true,
  })
);

//serve site files
app.use(express.static(path.join(__dirname, "public")));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("public/js/", express.static(__dirname + "/public/js"));
app.use("public/assets/", express.static(__dirname + "/public/assets"));
app.use("/public/", express.static(__dirname + "/public/"));
app.use("/public/css/", express.static(__dirname + "/public/css"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/", loginRoute);
app.use("/library", homeRoute);
app.use("/home", homeRoute);
app.use("/uploads", uploads);
app.use("/logout", loginRoute);
app.use("/create-account", new_account);
app.use(error);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
