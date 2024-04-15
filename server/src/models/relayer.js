const mongoose_user = require("mongoose");

const Relayer = mongoose_user.Schema({
  content: { type: String},
  services: {
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    ivr: { type: Boolean, default: true },
    push_notfication: { type: Boolean, default: true },
  },
  email_subject: { type: String},
  email: { type: String},
  number: { type: String, },
  push_socket: { type: String, },
  retries : { type: Number, default: 0 },
  priority : { type: Number, default: 2},

  createdAt: Date,
});
module.exports = mongoose_user.model("Relayer", Relayer);
