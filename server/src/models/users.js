const mongoose_user = require("mongoose");

const User = mongoose_user.Schema({
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
module.exports = mongoose_user.model("User", User);
