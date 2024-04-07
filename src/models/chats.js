"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const mongoose=require('mongoose')

const ChatSchema= new mongoose.Schema({

    members:Array,
    show:{
        type:Boolean,
        default:false
    },
    messages: [
        {
          type: Object,
        }
      ],
      count: {
        type: Number,
        default: 0 
      }
        
},{timestamps:true, collection:"chats"})

module.exports = mongoose.model('Chats', ChatSchema)