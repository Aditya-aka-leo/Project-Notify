const mongoose_topic_master = require("mongoose");

const topics = mongoose_topic_master.Schema({
  user_id: {
    type: [Number],
    required: true,
    unique: true,
  },
  topic_id: {
    type: Number,
    required: true,
    unique: true,
  },

});
module.exports = mongoose_topic_master.model("topics", topics);
