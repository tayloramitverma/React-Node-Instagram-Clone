const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')

app.get('/', (req,res)=>{
    res.send("Yes")
})

app.use(cors())

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

app.listen(PORT, ()=>{
    console.log("Server is running on "+PORT)
})