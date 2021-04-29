const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const { JWT_SECRET } = require('../keys')
const requiredLogin = require('../middleware/requiredLogin')

router.post('/signup', (req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(422).json({error:"All fields are required!"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already existing!"})
        }
        bcrypt.hash(password, 12)
        .then(hashedPassword=>{

            const user = new User({
                name,
                email,
                password:hashedPassword
            });
    
            user.save()
            .then((user)=>{
                res.json({message:"User saved successfully!"})
            })
            .catch(err=>{
                res.status(422).json({error:err})
            })
        })
        .catch(err=>{
            res.status(422).json({error:err})
        })
        
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

router.post('/signin', (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"Please provide email or password!"})
    }

    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password!"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id, name, email, bio, photo, follower, following} = savedUser
                res.json({message:"Successfully signed In!", token:token, user:{_id, name, email, bio, photo, follower, following}})
            }else{
                res.status(422).json({error:"Invalid email or password!"})
            }
        })
        .catch(err=>{
            res.status(422).json({error:err})
        })
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

router.put('/update-profile', requiredLogin, (req,res)=>{
    const {name, bio, photo} = req.body;

    if(!name){
       return res.status(422).json({error:"Please add name!"})
    }

    User.findByIdAndUpdate(req.user._id,{
        name,
        bio,
        photo
    },
    {new: true})
    .select("-password")
    .exec((err,result)=>{
        if(err){
             return res.status(422).json({error:err})
        }
         res.json({message:"success",result:result})
    })

})

module.exports = router;