const User = require("../models/users");

const { produceMessage } = require("../utils/kafka/producer");

const Create_User = async (req, res) => {
  try {
    console.log(req.body);
    const userExist = await User.findOne({ user_id: req.body.user_id });
    if (userExist) {
      return res.json("User Already Exists");
    } else {
      console.log("hello in create user");
      const newUser = await User.create({
        user_id: req.body.user_id,
        Allowed_Services: {
          Sms: req.body.sms_access,
          Email: req.body.email_access,
          Ivr: req.body.ivr_access,
          Push_Notification: req.body.push_socket_access,
        },
        Email: req.body.email,
        Number: req.body.number,
        Push_Socket: req.body.push_socket,
        CreatedAt: new Date(),
      });
      return res.json("The New User Is Created Successfully");
    }
  } catch (err) {
    console.log("Error Finding Or Creating User", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const Delete_User = async (req, res) => {
  try {
    const remove = await User.deleteOne({ user_id: req.body.user_id });
    console.log("Remove The User Successfully");
  } catch (err) {
    console.log("Error Deleting The User From Db..", err);
  }
};
const Notify_User_Prod = async (req, res) => {
  try {
    await produceMessage("Validation", req.body);
    return res.json("Pushed Into Validation Queue Successfully");
  } catch (err) {
    console.log("Error Sending Payload To Validation Queue", err);
    return res.json(500).json({ error: err });
  }
};

const Validator_Prioritizer_Prod = async (msg) => {
  try {
    let topic;
    switch (msg.priority) {
      case 0:
        topic = "High-priority";
        break;
      case 1:
        topic = "Mid-priority";
        break;
      default:
        topic = "Low-priority";
    }
    await produceMessage(topic, msg);
    console.log(`Msg Pushed To ${topic} Queue Successfully`);
  } catch (err) {
    console.log("Error Pushing Msg To The Priority Queue", err);
  }
};
const Service_Selector_Prod = async (msg) => {
  try {
    if (msg.services[0] == 1) await produceMessage("Sms", msg); // SMS
    if (msg.services[1] == 1) await produceMessage("Email", msg); // Email
    if (msg.services[2] == 1) await produceMessage("Ivr", msg); // Ivr
    if (msg.services[3] == 1) await produceMessage("Push-Notification", msg); // Push_Notification
    console.log("Msg Pushed Into Services Queue Respectively");
  } catch (err) {
    console.log("Error Pushing Into Servies Queue", err);
  }
};
module.exports = {
  Create_User,
  Notify_User_Prod,
  Validator_Prioritizer_Prod,
  Service_Selector_Prod,
  Delete_User,
};
