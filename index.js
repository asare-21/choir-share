const express = require("express");
const app = express();
const loginRoute = require("./routes/login");
const homeRoute = require("./routes/home");
const path = require("path");
require("dotenv").config();
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
app.use("/home", homeRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
