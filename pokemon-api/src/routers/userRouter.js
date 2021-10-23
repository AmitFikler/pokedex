const express = require("express")
const router = express.Router()


router.post("/",(req,res)=>{
    const username = req.header("username")
    console.log(username)
    res.send({username: username})
})

module.exports = router