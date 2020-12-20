const User = require("../models/user");

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


