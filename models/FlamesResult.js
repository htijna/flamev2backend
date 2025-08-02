const mongoose = require("mongoose");

const flamesResultSchema = new mongoose.Schema({
  name1: String,
  name2: String,
  result: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FlamesResult", flamesResultSchema);
