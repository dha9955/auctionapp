const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {paginationData} = require("../common-middleware/pagination");


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
  const { token } = req.params;
  const decoded = jwt.decode(token, { complete: true });
  console.log(decoded.payload._id);
  User.findOne({ _id: decoded.payload._id }).exec((error, user) => {
    if (error) {
      return res.status(400).json({ error });
    } else {
      return res.status(200).json({ user });
    }
  });
};

exports.getAllUsers = (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  User.find({role: "user"}).exec((error, users) => {
    if (error) {
      return res.status(400).json({ error });
    } else {
      total = users.length;
      const results = paginationData(users, page, limit);
      return res.status(200).json({ total, results });
    }
  });
};

exports.lockUser = (req, res) =>{
  User.findOne({_id:req.body.userId}).exec((error, user)=>{
    if (error) {
      return res.status(400).json({ error });
    } else {
      if(user.role != "locked"){
        user.role = "locked"
      }else {
        user.role = "user"
      }
      user.save()
      return res.status(201).json({ user });
    }
  })
}

