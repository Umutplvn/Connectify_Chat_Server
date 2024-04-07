"use strict";

/*--------------------------------------*
Connectify
/*--------------------------------------*/

require("express-async-errors");
const Chats = require("../models/chats");
const Users = require("../models/users");
const Messages = require("../models/messages");

module.exports = {

    createChat: async (req, res) => {
        const userId = req.user.toString()
        const { secondId } = req.params
    
        try {
            const chat = await Chats.findOne({ members: { $all: [userId, secondId] } })
    
            if (chat) {
                return res.status(200).send({
                    result: chat,
                })
            }else{
                const newChat = await Chats.create({ members: [userId, secondId] })
            
                res.status(200).json({
                    result: newChat,
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    },

    readMessagesInChat: async (req, res) => {
        const {chatId} = req.body
        const userId=req.user.toString()
        try {
            const chat = await Chats.findOne({_id:chatId});
            const updatedMessages = chat.messages.filter(message => message == userId);

            const updatedChat = await Chats.updateOne({ _id: chatId }, { $set: { messages: updatedMessages } });

            res.status(200).json(updatedChat)
            
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    },
    
    findAllChats: async (req, res) => {
        const userId = req.user.toString()
    
        try {
            const chats = await Chats.find({ members: { $in: [userId] } })
            const usersData = []
            for (const chat of chats) {
                for (const memberId of chat.members) {
                    if (memberId !== userId) {
                        const user = await Users.findOne({ _id: memberId }) 
                        if (user) {
                            const { _id, name, image, email } = user
                            usersData.push({
                                chat: chat,
                                user: {
                                    _id,
                                    name,
                                    image,
                                    email
                                }
                            })
                        }
                    }
                }
            }
            res.status(200).json({
                result: usersData
            })
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    },

  findChat:async(req, res)=>{
    const userId=req.user
    const {secondId}=req.params
    try {
        const chat=await Chats.findOne({members:{$in: [userId, secondId]}})
        const lastMessage = await Messages.findOne({ chatId: chat._id }).sort({ createdAt: -1 });

        res.status(200).send({
            result:{
                chat:chat,
                message:lastMessage
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
  },

  deleteChat:async(req, res)=>{

    const {chatId}=req.params
    const data=await Chats.deleteOne({ _id: chatId})

    if((data.deletedCount >= 1)){

        res.send({
            message:'Chat successfully deleted'
        })
    }else{
        res.send({
            message:"There is no recording to be deleted."
        })
    }
},
}

