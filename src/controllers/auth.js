const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = require("../models/user");

exports.signup = (req, res) => {
  User.findOne({ username: req.body.username }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        message: "User already registered",
      });

    const { firstName, lastName, username, password,email,contactNumber} = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      username,
      hash_password,
      email,
      contactNumber
    });
    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      if (data) {
        return res.status(201).json({
          message: "User created Successfully..!",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ username: req.body.username }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        const { _id, firstName, lastName, email, role, fullName, contactNumber } = user;
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName, contactNumber },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signinSocialAccount = (req, res) => {
  const user = new User({
    email: req.body.email,
    username: req.body.uid,
    authSocialID: req.body.uid,
    lastName: req.body.displayName
  })
  console.log(user)
  user.save().then(()=>{
    const token = jwt.sign(
      {_id:user._id, role: user.role},
      process.env.JWT_SECRET,
      {expiresIn: "1d"}
    )
    return res.status(201).json({token, user})
  })
}



exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};

