const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Post = mongoose.model("Post")

const requiredLogin = require('../middleware/requiredLogin')

router.post('/createpost', requiredLogin, (req,res)=>{
    const {title, body, photo} = req.body;
    if(!title || !body || !photo){
       return res.status(422).json({error:"Please add title or body!"})
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
        res.status(422).json({error:err})
    })
})

router.get('/userposts', requiredLogin, (req,res)=>{

    Post.find({postedBy:req.user._id})
    .sort( { _id : -1} )
    .populate("postedBy","_id name")
    .then(result=>{
        res.json({message:"All User Posts!",posts:result})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
    
})

router.get('/posts', requiredLogin, (req,res)=>{

    Post.find()
    .sort( { _id : -1} )
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .then(result=>{
        res.json({message:"All Posts!",posts:result})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
    
})

router.put('/like', requiredLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId,
    {   
        $push:{
            likes:req.user._id
        }
    },
    {
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err,result)=>{
        if(err){
             return res.status(422).json({error:err})
        }
         res.json({message:"success",result:result})
    })
})

router.put('/unlike', requiredLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId,
    {   
        $pull:{
            likes:req.user._id
        }
    },
    {
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err,result)=>{
        if(err){
             return res.status(422).json({error:err})
        }
         res.json({message:"success",result:result})
    })
})

router.put('/comment', requiredLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId,
    {   
        $push:{
            comments:{
                text:req.body.text,
                postedBy:req.user._id
            }
        }
    },
    {
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err,result)=>{
        if(err){
             return res.status(422).json({error:err})
        }
         res.json({message:"success",result:result})
    })
})


router.delete('/delete/:postId', requiredLogin, (req, res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json({message:"Successfully Deleted!"})
            })
            .catch(err=>{
                res.status(422).json({error:err})
            })
        }
    })
})

module.exports = router