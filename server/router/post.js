const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Post = mongoose.model("Post")

const requiredLogin = require('../middleware/requiredLogin')

router.post('/createpost', requiredLogin, (req,res)=>{
    const {title, body, photo} = req.body;
    if(!title || !body || !photo){
       return res.status(422).json({message:"Please add title or body!"})
    }

    const post = new Post({
        title,
        body,
        photo,
        postedBy:req.user
    })

    post.save()
    .then(result=>{
        res.json({message:"Post created successfully!",post:result})
    })
    .catch(err=>{
        res.status(422).json({message:err})
    })
})

router.get('/userposts', requiredLogin, (req,res)=>{

    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(result=>{
        res.json({message:"All User Posts!",posts:result})
    })
    .catch(err=>{
        res.status(422).json({message:err})
    })
    
})

router.get('/posts', requiredLogin, (req,res)=>{

    Post.find()
    .populate("postedBy","_id name")
    .then(result=>{
        res.json({message:"All Posts!",posts:result})
    })
    .catch(err=>{
        res.status(422).json({message:err})
    })
    
})



module.exports = router