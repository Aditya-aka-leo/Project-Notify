const mongoose = require("mongoose");

const User = mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
  },
  services: {
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    ivr: { type: Boolean, default: true },
    push_notfication: { type: Boolean, default: true },
  },
  email: { type: String},
  number: { type: String, unique: true },
  push_socket: { type: String, unique: true },

  createdAt: Date,
});
module.exports = mongoose.model("User", User);
