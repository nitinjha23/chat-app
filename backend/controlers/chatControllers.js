const asyncHandler = require('express-async-handler')
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const accessChat =  asyncHandler(async (req,res)=>{
    const {UserId} = req.body;
    console.log(UserId)
    if(!UserId){
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    console.log("sdfi")
    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},   // user that is logged in
            {users:{$elemMatch:{$eq:UserId}}},   // UserId that we have sent
            ]
    }).populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat,{
        path:'latestMessage.sender',
        select:'name pic email',
    });
    console.log(isChat)
    if(isChat.length>0){
        res.send(isChat[0]);
    }else {
        var chatData = {
            chatName: "sender",
            isGroupChat:false,
            users:[req.user._id,UserId],
        };

        try {
            const createdChat = await Chat.create(chatData);

            const Fullchat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(Fullchat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats = asyncHandler(async (req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("latestMessage")
                .sort({updatedAt:-1})
             .then(async(results)=>{
                    results = await User.populate(results,{
                        path:"latestMessage.sender",
                        select:"name pic email",
                    });
                    res.status(200).send(results);
             });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req,res)=>{
    if(!req.body.users||!req.body.name){
        return res.status(400).send({message:"Please fill all the fields"});
    }
    var users = JSON.parse(req.body.users);
    if(users.length<2){
        return res.status(400).send("atleast 2 users are required to form a group chat");
    }
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName : req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        })
        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
            .populate("users","-password")
            .populate("groupAdmin","-password");
            res.status(200).send(fullGroupChat);
    } catch (error) {
        res.status(200);
        throw new Error(error.message);
    }
})

const renameGroup = asyncHandler(async(req,res)=>{
    const {chatId,chatName} = req.body;

    const updatedChat = await  Chat.findByIdAndUpdate(chatId,
        {
            chatName
        },
        {
            new:true,   //now it will return us the updated value or else it would have returned us old value.
        }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");

        if(!updatedChat){
            res.status(404);
            throw new Error("Chat not found");
        }else{
            res.json(updatedChat);
        }
});

const addToGroup = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {$push:{users:userId}},
        {new:true}
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!added){
        res.status(404);
        throw new Error("Chat not found");
    }
    else {
        res.json(added);
    }
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!removed) {
        res.status(404);
        throw new Error("Chat not found");
    }
    else {
        res.json(removed);
    }
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }