const express = require("express")
const router = express.Router()


router.post("/",(req,res)=>{
    const username = req.header("username")
    return res.json({username: username})
})

module.exports = router