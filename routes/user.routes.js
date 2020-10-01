const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('./../models/user.model');
const jwt = require('jsonwebtoken');

router.get('/api/users', (req, res)=>{
    User.find({})
    .select('name email updated created photo')
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(400).json({
            error:error
        })
    })
})


router.post('/api/create_user',(req, res)=>{
    bcrypt.hash(req.body.password,10,(error, hashed_password)=>{
        if(error){
            res.status(400).json({
                error :"Authentication Error"
            })
        }else{
            const user = new User({
                name: req.body.name ,
                email: req.body.email , 
                password : hashed_password
            });

            user.save()
            .then((response)=>{
                return res.status(200).json({
                    response: response
                })
            })
            .catch(error=>{
                console.log(error)
            })
        }
    })
})

router.get('/api/get_user/:userId' , async (req, res)=>{
    if(!req.isAuth){
        return res.status(400).json({
            error:"Auth Error"
        })
    }
    await User.findById(req.params.userId)
    .populate('following','_id name')
    .populate('followers','_id name ')
    .exec()
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(400).json({
            error:error
        })
    })
})

router.put('/api/update_user/:userId',async (req, res)=>{
    let user = await User.findById({ _id:req.params.userId} );
    let result  = await User.findOneAndUpdate({ _id:req.params.userId} ,Object.assign(user, req.body) ,{ new : true });
    res.status(200).json({
       response: result
   })
})

router.delete('/api/delete_user/:userId', async (req, res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    let deleteUser = await User.deleteOne({ _id : req.params.userId});
    res.status(200).json({
        response: deleteUser
    })
})


router.post('/api/signin', async (req, res)=>{
    try{
        let user = await User.findOne({ "email": req.body.email });
        if (!user)
          return res.status('401').json({ error: "User not found" })
        if (! bcrypt.compare(req.body.password ,user.password)) { 
            return res.status('401').send({ error: "Email and password don't match." })
        }
        const token = jwt.sign({ _id: user._id }, 'MY_JWT_SECRET_KEY');
        res.cookie('t', token, { expire: new Date() + 9999 })
        res.json({
            token,
            user: {
            _id: user._id,
            name: user.name,
            email: user.email
            }
        })
    }catch (err) {
        return res.status('401').json({ error: "Could not sign in" })
 } 
})

router.get('/api/signout',(req, res)=>{
    res.clearCookie("t")
    return res.status('200').json({
      message: "signed out"
    })
})

router.put('/api/users/follow',async (req, res , next)=>{
    try{
        await User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}}) 
        next()
      }catch(err){
        return res.status(400).json({
          error: 'error'
        })
      }},
      async (req, res)=>{
        try{
            let result = await User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
                                    .populate('following', '_id name')
                                    .populate('followers', '_id name')
                                    .exec()
              result.password = undefined
              res.json(result)
            }catch(err) {
              return res.status(400).json({
                error: 'error'
              })
            }  
         }
)

router.put('/api/users/unfollow',async (req, res , next)=>{
    try{
        await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}) 
        next()
      }catch(err) {
        return res.status(400).json({
          error: 'error'
        })
      }
} ,
async (req, res )=>{
    try{
        let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
                                .populate('following', '_id name')
                                .populate('followers', '_id name')
                                .exec() 
        result.password = undefined
        res.json(result)
      }catch(err){
          return res.status(400).json({
            error: 'error'
          })
      }
  }
)

router.get('/api/users/findpeople/:userId' ,async (req,res)=>{
    if(!req.isAuth){
        res.status(401).json({
            response:"UnAuthorized"
        })
    }
    let following = await  User.findById(req.params.userId)
    await  following.following.push(User.findById(req.params.userId)._id)
    try {
      let users = await User.find({ _id: { $nin : following.following } }).select('name photo');
      return res.json(users)
    }catch(err){
      return res.status(400).json({
        error: 'error'
      })
    }
})


module.exports  = router;


