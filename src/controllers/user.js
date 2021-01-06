const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { paginationData } = require("../common-middleware/pagination");

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
  User.find({ role: { $in: ["user", "locked"] } }).exec((error, users) => {
    if (error) {
      return res.status(400).json({ error });
    } else {
      total = users.length;
      const results = paginationData(users, page, limit);
      return res.status(200).json({ total, results });
    }
  });
};

exports.lockUser = (req, res) => {
  User.findOne({ _id: req.body.userId }).exec((error, user) => {
    if (error) {
      return res.status(400).json({ error });
    } else {
      if (user.role != "locked") {
        user.role = "locked";
      } else {
        user.role = "user";
      }
      user.save();
      return res.status(201).json({ user });
    }
  });
};

exports.updateUser = (req, res) => {
  User.findOne({ _id: req.body.userId }).exec(async (error, user) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (user) {
      if (req.body.password) {
        const isPassword = await user.authenticate(req.body.password);
        if (isPassword) {
          const hash_password = await bcrypt.hash(req.body.password, 10);
          user.hash_password = hash_password
          if (req.body.firstName) {
            user.firstName = req.body.firstName;
          }
          if (req.body.lastName) {
            user.lastName = req.body.lastName;
          }
          if (req.body.contactNumber) {
            user.contactNumber = req.body.contactNumber;
          }
          user.save().then(() => {
            return res.status(200).json({ user });
          });
        } else
        return res.status(200).json({message: "Your password is not correct!!!"})
      } 
    }
  });
};
