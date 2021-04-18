const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');

require('./models/user');
app.use(express.json())
app.use(require('./router/auth'))
//mongodb database connection
mongoose.connect(MONGOURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

mongoose.connection.on('connected',()=>{
    console.log('Connected to the mongodb database!')
});

mongoose.connection.on('error', (err)=>{
    console.log("Mongodb database connection error", err)
});


app.listen(PORT, ()=>{
    console.log("Server is running on "+PORT);
})