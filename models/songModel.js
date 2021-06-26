const { model, Schema } = require("mongoose");

const audioPartSchema = Schema({
  partName: { type: String, required: true },
  audioLink: { type: String, required: true },
});

const uploadSchema = Schema({
  composer: {
    type: String,
    required: true,
  },
  createdBy: { type: String, required: true },
  lyrics: {
    type: String,
    required: true,
  },
  audioParts: [audioPartSchema],
  name: {
    required: true,
    type: String,
  },
  time: {
    required: true,
    type: Date,
    default: Date.now(),
  },
  audio: {
    type: String,
  },
});

const song = model("song model", uploadSchema);
module.exports.song = song;
