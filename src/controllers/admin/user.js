const User = require("../../models/user");

exports.getAllUsers = (req, res) =>{
    User.find({}).exec((error, users)=>{
        if(error){
            return res.status(400).json({ error });
        } else {
            return res.status(200).json({users})
        }
    })
}