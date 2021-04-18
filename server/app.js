const express = require('express');
const app = express();
const PORT = 5000;

const myCustomMiddleware = (req,res,next) => {
    console.log("Middleware executed now!");
    next()
}

//app.use(myCustomMiddleware);

app.get('/', (req, res)=>{
    res.send("Hello My Node World!")
});

app.get('/aboutme', myCustomMiddleware, (req, res)=>{
    res.send("Hi, I'm Taylor!")
});

app.listen(PORT, ()=>{
    console.log("Server is running on "+PORT);
})