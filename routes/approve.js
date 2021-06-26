const { Router } = require("express");
const router = Router();
const { user } = require("../models/userMode");
const { song } = require("../models/songModel");
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
router.post("/new_song/:songId", (req, res) => {
  user.findById(req.params.songIdId, (err, result) => {});
});

module.exports = router;
