"use strict"

/*--------------------------------------*
Connectify
/*--------------------------------------*/

const router = require('express').Router()
const Chats = require('../controller/chats')

router.route('/:secondId').post(Chats.createChat)
router.route('/findall').get(Chats.findAllChats)
router.route('/readchat').put(Chats.readMessagesInChat)
router.route('/find/:secondId').get(Chats.findChat)
router.route('/deletechat/:chatId').delete(Chats.deleteChat)

    

module.exports = router