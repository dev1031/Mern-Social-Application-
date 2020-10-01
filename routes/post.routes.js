const express = require('express');
const router = express.Router();
const Post = require('./../models/post.model');
const User = require('../models/user.model');

router.post('/api/posts/new/:userId', async (req, res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    try{
        let post = new Post (req.body);
        post.postedBy = await User.findById(req.params.userId);
        let result = await  post.save();
        res.status(200).json(result)
    }
    catch(error){
        return res.status(200).json({
            error : error
        })
    }
})

router.get('/api/posts' ,async (req, res)=>{
  await  Post.find({})
    .select('_id photo')
    .then(response=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(400).json({
            error: error
        })
    })
})

router.get('/api/posts/by/:userId' ,async (req, res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    try {
        let posts = await Post.find({postedBy: req.params.userId})
                    .populate('comments.postedBy', '_id name photo')
                    .populate('postedBy', '_id name photo')
                    .sort('-created')
                    .exec()
        res.json(posts)
      } catch(err) {
            return res.status(400).json({
            error: 'error'
 }) }
})

router.get('/api/posts/feed/:userId',async (req, res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    let following = await User.findById(req.params.userId)
    following.following.push(following._id)
    try{
      let posts = await Post.find({postedBy: { $in : following.following } })
                            .populate('comments.postedBy', '_id name photo')
                            .populate('postedBy', '_id name photo')
                            .sort('-created')
                            .exec()
      res.json(posts)
    }catch(err){
      return res.status(400).json({
        error: err
      })
    }
})

router.put('/api/posts/like',async (req, res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    try{
        let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
        res.json(result)
      }catch(err){
          return res.status(400).json({
            error: err
          })
      }
})

router.put('/api/posts/unlike',async (req, res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    try{
        let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
        res.json(result)
      }catch(err){
        return res.status(400).json({
          error: err
        })
      }
})

router.put('/api/posts/comment',async (req, res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    let comment = req.body.comment
    comment.postedBy = req.body.userId
    try{
        let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
                    .populate('comments.postedBy', '_id name photo')
                    .populate('postedBy', '_id name photo')
                    .exec()
        res.json(result)
    }catch(err){
        return res.status(400).json({
        error: err
        })
    }
})

router.put('/api/posts/uncomment',async (req, res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    let comment = req.body.comment
    try{
        let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .exec()
        res.json(result)
    }catch(err){
        return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
        })
    }

})

router.delete('/api/posts/:postId' ,async (req, res)=>{
    if(!req.isAuth){
        res.status(400).json({
            error:"UnAuthorized"
        })
    }
    try {
        let result = await Post.deleteOne({_id : req.params.postId})
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error : error
        })
    }
    
})

module.exports  = router;
