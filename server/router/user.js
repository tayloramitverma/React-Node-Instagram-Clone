const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const Post = mongoose.model("Post")
const User = mongoose.model("User")

const requiredLogin = require('../middleware/requiredLogin')


router.get('/user/:id', (req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:user._id})
        .populate("postedBy", "_id name bio photo")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({message:"success",user:user, posts:result})
        })
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

router.put('/follow', requiredLogin, (req, res)=>{
    User.findByIdAndUpdate(req.user._id,
    {   
        $push:{
            following:req.body.followId
        }
    },
    {new:true},(err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.body.followId,
        {   
            $push:{
                follower:req.user._id
            }
        },
        {new:true})
        .select("-password")
        .then(result=>{
            res.json(result)
        })
        .catch((err)=>{
            res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow', requiredLogin, (req, res)=>{
    User.findByIdAndUpdate(req.user._id,
    {   
        $pull:{
            following:req.body.unfollowId
        }
    },
    {new:true},(err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.body.unfollowId,
        {   
            $pull:{
                follower:req.user._id
            }
        },
        {new:true})
        .select("-password")
        .exec((err,result)=>{
        if(err){
             return res.status(422).json({error:err})
        }
         res.json(result)
    })
    })
})

module.exports = router