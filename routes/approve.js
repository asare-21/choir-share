const { Router } = require("express");
const router = Router();
const { user } = require("../models/userMode");
const { song } = require("../models/songModel");
var multer = require("multer");
var fs = require("fs");
var storage = multer.memoryStorage();
const cloudinary = require("cloudinary");
const datauri = require("datauri");
require("dotenv").config();
var upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

router.post("/:id", (req, res) => {
  // find user by id and update the acount status
  console.log(req.body);
  user.findByIdAndUpdate(
    { _id: req.params.id },
    {
      approved: true,
    },
    (err, result) => {
      console.log(err, result);
      let pendingUser = [];
      // if (req.session.passport == undefined)
      //   return res.json({ error: "Access Denied" });
      if (true) {
        console.log(result);
        user.find((err, result) => {
          res.json({ result });
        });
      } else {
        res.redirect("/");
      }
    }
  );
});

// endpoint for create a new song. For admins only
router.post("/new_song/:adminId", (req, res) => {
  user.findById(req.params.adminId, (err, result) => {
    if (!result.admin) {
      res.status(201).json({ error: "access is denied" });
    } else {
      song(req.body).save(err, (data) => {
        song.find((err, result) => {
          console.log(result);
          res.json({ result });
        });
      });
    }
  });
});

// endpoint for updating song part. For members only
router.post(
  "/new_song_part/:songId",
  upload.single("audio"),
  (req, res, next) => {
    if (req.session.passport == undefined)
      return res.json({ err: "access denied" }).status(400);
    cloudinary.v2.uploader.upload(
      req.file.path,
      { resource_type: "video" },
      function (error, result) {
        // console.log(result, error);
        song.findByIdAndUpdate(
          req.params.songId,
          {
            $push: {
              audioParts: {
                partName: req.body.partName,
                audioLink: result.secure_url,
              },
            },
          },
          (err, result) => {
            console.log(err, result);
            if (err) return res.json({ err });
            song.find((err, result) => {
              res.json({ msg: "done uploading", result });
            });
          }
        );
      }
    );
  }
);

router.post("/lyrics_update/:songId", (req, res) => {
  if (req.session.passport == undefined)
    return res.json({ err: "access denied" }).status(400);

  console.log(req.body.lyrics, req.params.songId);
  song.findByIdAndUpdate(
    req.params.songId,
    { lyrics: req.body.lyrics },
    (err, result) => {
      res.json({ msg: "received" });
      // res.redirect("/library");
    }
  );
});
module.exports = router;
