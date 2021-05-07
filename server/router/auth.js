const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const { JWT_SECRET } = require('../config/keys')
const requiredLogin = require('../middleware/requiredLogin')
const nodemailer = require('nodemailer')
const sandgridTransport = require('nodemailer-sendgrid-transport')

const transpoter = nodemailer.createTransport(sandgridTransport({
    auth:{
        api_key:"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"
    }
}))

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
                transpoter.sendMail({
                    to:user.email,
                    from:"no-reply@beingidea.com",
                    subject:"Signup success on Taylor Instagram!",
                    html:'<h1>Welcome to Tyalor Instagram</h1>'
                })
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