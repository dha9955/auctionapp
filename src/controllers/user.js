const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.getUserbyId = (req, res) => {
  const { userId } = req.params;
  if (userId) {
    User.findOne({ _id: userId }).exec((error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        res.status(200).json({ user });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.getUserbyToken = (req, res) => {
  const token = req.body.token
  const decoded = jwt.decode(token, {complete: true})
  console.log(decoded.payload._id)
  User.findOne({_id:decoded.payload._id}).exec((error, user)=>{
    if(error){
        return res.status(400).json({ error });
    } else {
        return res.status(200).json({user})
    }
})
}