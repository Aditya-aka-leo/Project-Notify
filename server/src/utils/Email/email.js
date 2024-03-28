var nodemailer = require("nodemailer");

const send_email = async (msg) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
  });
console.log(process.env.EMAIL_ID)
console.log(process.env.EMAIL_PASS)
  var mailOptions = {
    from: process.env.EMAIL_ID,
    to: msg.email,
    subject: msg.Email.subject,
    text: msg.content,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = { send_email };
