const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// update user

router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('account updated');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can update only you account');
  }
});

// delete user


router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
 
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json('account deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json(' delete  account');
  }
});


// get a user


router.get("/id:", async(req, res)=>{
    try{

        const user = await User.findById(req.params.id)
        const {password, updateAt, ...other} = user._doc
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err)
    }
})

// get all user


// follow a user



router.put("/:id/follow", async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try{

            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                res.status(200).json("user has been followed")
                await currentUser.updateOne({
                  $push: { followings: req.params.id },
                });

            }else{
                res.status(403).json("You already follow this user")
            }

        }catch(err){
            res.status(500).json(err)
        }

    }else{
        res.status(403).json("you can't follow your self")
    }
})


// unfollow a user


router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        res.status(200).json('user has been unfollowed');
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });
      } else {
        res.status(403).json('You dont follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't unfollow your self");
  }
});


module.exports = router;
