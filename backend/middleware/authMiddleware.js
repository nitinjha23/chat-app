const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');

const protect = expressAsyncHandler(async (req,res,next)=>{
    let token ;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(' ')[1];
            
            //decodes token id
            const decoded = jwt.verify(token, "DJ_Monster");

            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized User,No token");
        }
    }
})
module.exports = {protect};