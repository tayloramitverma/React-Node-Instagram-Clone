const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const { JWT_SECRET } = require('../keys')
const requiredLogin = require('../middleware/requiredLogin')

router.get('/', (req,res)=>{
    res.send("Hello Taylor!")
});

router.post('/signup', (req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(422).json({message:"All fields are required!"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({message:"User already existing!"})
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
                res.status(422).json({message:err})
            })
        })
        .catch(err=>{
            res.status(422).json({message:err})
        })
        
    })
    .catch(err=>{
        res.status(422).json({message:err})
    })
})

router.post('/signin', (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({message:"Please provide email or password!"})
    }

    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({message:"Invalid email or password!"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)

                res.json({message:"Successfully signed In!", token:token})
            }else{
                res.status(422).json({message:"Invalid email or password!"})
            }
        })
        .catch(err=>{
            res.status(422).json({message:err})
        })
    })
    .catch(err=>{
        res.status(422).json({message:err})
    })
})

router.get('/protected', requiredLogin, (req,res)=>{
    res.json({message:"I'm in!"})
})

module.exports = router;