const User = require("../models/users");

const { produceMessage } = require("../utils/kafka/producer");
const Relayer = require("../models/relayer");

const Create_User = async (req, res) => {
  try {
    const userExist = await User.findOne({ user_id: req.body.user_id });
    if (userExist) {
      return res.json("User Already Exists");
    } else {
      const newUser = await User.create({
        user_id: req.body.user_id,
        services: {
          sms: req.body.services.sms,
          email: req.body.services.email,
          ivr: req.body.services.ivr,
          push_notification: req.body.services.push_notification,
        },
        email: req.body.email,
        number: req.body.number,
        push_socket: req.body.push_socket,
        createdAt: new Date(),
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
    res.json("Remove The User Successfully");
  } catch (err) {
    res.status(500).json("Error Deleting The User From Db..", err);
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
    if (msg.services.sms == 1) produceMessage("Sms", msg); // SMS
    if (msg.services.email == 1) produceMessage("Email", msg); // Email
    if (msg.services.ivr == 1) produceMessage("Ivr", msg); // Ivr
    if (msg.services.push_notification == 1)
      produceMessage("Push-Notification", msg); // Push_Notification
    console.log("Msg Pushed Into Services Queue Respectively");
  } catch (err) {
    console.log("Error Pushing Into Servies Queue", err);
  }
};
const Service_Selector_Prod_Bulk = async (msg) => {
  count = 0;
  try {
    for (user of msg.user_id) {
      let data = {};
      const userExist = await User.findOne({ user_id: user });
      if (userExist) {
        data["user_id"] = userExist.user_id;
        data["content"] = msg.content;
        data["priority"] = msg.priority;
        data["services"] = {
          sms: userExist.services.sms,
          email: userExist.services.email,
          ivr: userExist.services.ivr,
          push_notification: userExist.services.push_notification,
        };

        if (
          userExist.services.sms &&
          userExist.number != 0 &&
          msg.services.sms == 1
        )
          data["number"] = userExist.number;
        if (
          userExist.services.email &&
          userExist.email != 0 &&
          msg.services.email == 1
        ) {
          data["email_subject"] = msg.email_subject;
          data["email"] = userExist.email;
        }
        if (
          userExist.services.ivr &&
          userExist.ivr != 0 &&
          msg.services.ivr == 1
        )
          data["ivr"] = userExist.number;
        if (
          userExist.services.push_notification &&
          userExist.push_notification != 0 &&
          msg.services.push_notification == 1
        )
          data["push_notification"] = userExist.push_socket;
        await Service_Selector_Prod(data);
        count++;
      }
    }
    console.log(
      `Msg For ${count} User Pushed Into Services Queue Respectively`
    );
  } catch (err) {
    console.log("Error Pushing Bulk Msg Into Servies Queue", err);
  }
};

const replay_msg = async (msg) => {
  try {
    if (msg.retries === undefined) {
      msg.retries = 0;
    } else {
      msg.retries = msg.retries + 1;
    }
    if (msg.retries <= 2) {
      const newUser = Relayer.create({
        content: msg.content,
        services: {
          sms: msg.services.sms,
          email: msg.services.email,
          ivr: msg.services.ivr,
          push_notification: msg.services.push_notification,
        },
        email_subject: msg.email_subject,
        email: msg.email,
        number: msg.number,
        push_socket: msg.push_socket,
        retries: msg.retries,
        priority: msg.priority,
        createdAt: new Date(),
      });
    } else {
      console.log("Max Retries Reached , Dropping The Request");
    }
  } catch (error) {
    console.error("error replaying the msg into Db", error);
  }
};

module.exports = {
  Create_User,
  Notify_User_Prod,
  Validator_Prioritizer_Prod,
  Service_Selector_Prod,
  Service_Selector_Prod_Bulk,
  Delete_User,
  replay_msg,
};
