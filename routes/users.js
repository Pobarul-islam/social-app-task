const router = require('express').Router();

router.get("/", (req, res)=>{
    res.send("Hi, this is user route")
})

module.exports = router;


