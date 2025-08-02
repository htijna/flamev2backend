const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  image: String,
  time: String,
  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
