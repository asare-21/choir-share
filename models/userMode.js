const { model, Schema } = require("mongoose");

const audioPartSchema = Schema({
  partName: { type: String, required: true },
  audioLink: { type: String, required: true },
});

const userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    reqired: true,
  },
  name: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const user = model("User Model", userSchema);
module.exports.user = user;
// the uploads array will contain a link of the uploaded audio.
// the lyrics,composer and others will be stored too
