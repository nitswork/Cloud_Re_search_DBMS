import express from 'express';

const app = express();


app.listen('/' , (req,res) => {
    res.send("Hello World");
})