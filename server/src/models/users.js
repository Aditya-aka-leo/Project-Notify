const mongoose = require("mongoose");

const User = mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
  },
  Allowed_Services: {
    Sms: { type: Boolean, default: true },
    Email: { type: Boolean, default: true },
    Ivr: { type: Boolean, default: true },
    Push_Notfication: { type: Boolean, default: true },
  },
  Email: { type: String, unique: true },
  Number: { type: String, unique: true },
  Push_Socket: { type: String, unique: true },

  CreatedAt: Date,
});
module.exports = mongoose.model("User", User);
