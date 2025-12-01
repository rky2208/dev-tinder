const express = require("express");

const appClient = new express();

// Request Handler
appClient.use("/test",(req,res)=>{
    console.log("R---")

    res.send("Hello")
})

appClient.listen(3000,()=>{
    console.log("listening..")
})