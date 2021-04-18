const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')

const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next) =>{
    const {authorization} = req.headers;
    if(!authorization){
        res.status(422).json({message:"You muct be logged In!"})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err,payload)=>{
        if(err){
            res.status(422).json({message:"You muct be logged In!"})
        }
        const {_id} = payload

        User.findById(_id)
        .then(userdata=>{
            req.user = userdata
            next()
        })
        .catch(err=>{
            res.status(422).json({message:err})
        })
    })
}
