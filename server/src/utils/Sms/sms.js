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
    .then((message) => console.log(message.sid));
  
    
};
module.exports = { send_sms };
