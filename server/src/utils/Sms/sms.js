const { replay_msg } = require("../../controller/controller");
const send_sms = async (msg) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: msg.content,
      from: process.env.TWILIO_NUMBER,
      to: msg.number,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => {
      console.log(
        "user not availble or twilio server not responding , MSG Replayed Starting",
        err
      );
      msg.services.email = 0;
      msg.services.ivr = 0;
      msg.services.push_notification = 0;
      replay_msg(msg);
      console.log("MSG Replayed Successfully");
    });
};
module.exports = { send_sms };
