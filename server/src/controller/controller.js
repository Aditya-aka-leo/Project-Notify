const User = require("../models/users");
const { notify } = require("../routes/main");
const {prodValidator} = require('../utils/kafka/producer')
const create_user = async (req, res) => {
  try {
    console.log(req.body);
    const userExist = await User.findOne({ user_id: req.body.user_id});
    if (userExist) {
      return res.json("User Already Exists");
    } else {
      console.log('hello in create user');
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
      return res.json('The New User Is Created Successfully');
    }
  } catch (err) {
    console.log("Error Finding Or Creating User", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const notify_user = async(req,res)=>{
  try{
    await prodValidator(req.body);
    return res.json('Pushed Into Validation Queue Successfully');
   }
   catch(err)
   {
    console.log('Error Sending Payload To Validation Queue',err);
    return res.json(500).json({error : err});
  }
}
// const validator = async(msg)=>{
  
// }
module.exports = {create_user,notify_user};