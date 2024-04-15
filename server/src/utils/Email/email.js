var nodemailer = require("nodemailer");
const {replay_msg} = require('../../controller/controller');
const send_email = async (msg) => {
  try{
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL_ID,
      to: msg.email,
      subject: msg.email_subject,
      text: msg.content,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  catch(err){
    console.log('user not availble or smtp server not responding , MSG Replayed Starting',err);
    msg.services.sms = 0
    msg.services.ivr = 0
    msg.services.push_notification = 0
    replay_msg(msg);
    console.log('MSG Replayed Successfully');
  }
  
};
module.exports = { send_email };
