const express = require('express')
//const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')

//app.use(cors())

//mongodb database connection
mongoose.connect(MONGOURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})

mongoose.connection.on('connected',()=>{
    console.log('Connected to the mongodb database!')
})

mongoose.connection.on('error', (err)=>{
    console.log("Mongodb database connection error", err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./router/auth'))
app.use(require('./router/post'))
app.use('/api', require('./router/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log("Server is running on "+PORT)
})