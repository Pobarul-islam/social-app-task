const router = require('express').Router();
const Post = require('../models/Post');

// create a post

router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a post

router.put('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);

  try {
    if (post.userId === req.body.usrId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json('the post hasbeen updated');
    } else {
      res.status(403).json('you can update only your post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post
// like a post
// get a post
// get timeline post

module.exports = router;
