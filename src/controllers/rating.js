const Rating = require("../models/rating");
const User = require("../models/user");

exports.createRating = (req, res) => {
  Rating.findOne({ reviewer: req.user._id, user: req.body.user }).exec(
    (error, rating) => {
      if (rating) {
        return res.status(400).json({
          message: "You've already rated this user...",
        });
      }
      const _rating = new Rating({
        reviewer: req.user._id,
        user: req.body.user,
        star: req.body.star,
      });
      _rating.save((error, data) => {
        if (error) return res.status(400).json({ error });
        if (data) {
          Rating.aggregate(
            {user: req.body.user},
            {total: {$sum: "star"},
            count: {$count: "user"}
          }).exec((error, rating)=>{
            if (error) return res.status(400).json({ error });
            else{
              User.findOne({_id:req.body.user}).exec((error, user)=>{
                if (error) return res.status(400).json({ error });
                else{
                  user.rating = (rating.total+data.star)/(rating.count + 1)
                  user.save((error, result)=>{
                    if (error) return res.status(400).json({ error });
                    else{
                      res.status(200).json({ data: data , user:user });
                    }
                  })
                }
              })
            }
          })
        }
      });
    }
  );
};

exports.getRatingByUser = (req, res) => {
  const {userId} = req.params
  Rating.find({user:userId}).exec((error, rating)=>{
    if (error) return res.status(400).json({ error });
    else{
      return res.status(200).json({ rating });
    }
  })
}