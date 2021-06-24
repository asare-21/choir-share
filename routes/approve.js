const { Router } = require("express");
const router = Router();
const { user } = require("../models/userMode");

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
          result.forEach((r) => {
            if (!r.approved) {
              pendingUser.push(result);
            }
          });
        });
        res.json({ pendingUser });
      } else {
        res.redirect("/");
      }
    }
  );
});

module.exports = router;
