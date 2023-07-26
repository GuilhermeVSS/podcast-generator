// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const { Schema } = mongoose;

const audioSchema = new Schema(
  {
    title: String,
    audio: Buffer,
    text: String,
  },
  { timestamps: true },
);

audioSchema.index({ title: 1 });

const Audio = mongoose.model('audio', audioSchema);

module.exports = {
  Audio,
};
