const { getUserOnlineByNickname, addPrivateChat, getPrivateChat } = require('./users'),
    chatPrivateRoom = require('../models/privateChatMessage'),
    Notification = require('../models/Notifications')
    dateHelpers = require('../helpers/dates')

module.exports = function (io, socket) {
    // TODO: Create ERROR HANDLERS
    socket.on('message', async (data) => {
        const { userId, nickname, receivedUser: {receivedNickname, userDestinyId}, message } = data
        if (message.length > 0) {
            const t = new Date()
            // // SenderID
            // const user = getUserOnlineByNickname(nickname)
            // let userId
            // if(user) {
            //     userId = user.userId
            // } else {

            // }
            // User Receiver
            const userDestiny = getUserOnlineByNickname(receivedNickname)
            let socketId = undefined
            if(userDestiny) {
            socketId = userDestiny.socketId
            }
            if(!userDestiny) {
            await Notification
            .findOne({userId: userDestinyId})
            .exec( async (err, userNotifications) => {
                if (err) {
                    console.log(err)
                }
                if (userNotifications) {
                   userNotifications.notifications.push({
                    fromUser: userId
                   })
                  await userNotifications.save()
                }
                if(!userNotifications) {
                   const newUserNotifications =  new Notification({
                        userId: userDestinyId,
                        notifications: [
                            {
                                fromUser: userId
                            }
                        ]
                    })
                   await newUserNotifications.save()
                }
            })
            }
            let privateChat = getPrivateChat(userId, userDestinyId)
            if (!privateChat) {
                await chatPrivateRoom
                    .findOne({
                        $or: [
                            { $and: [{ userId: userId }, { userIdTwo: userDestinyId }] },
                            { $and: [{ userId: userDestinyId }, { userIdTwo: userId }] }
                        ]
                    })
                    .exec(async (err, chat) => {
                        if (err) {
                            console.log(err)
                        }
                        if (!chat) {
                            const newChat = new chatPrivateRoom({
                                userId: userId,
                                userIdTwo: userDestinyId,
                                messages: []
                            })
                            await newChat.save((err, chat) => {
                                privateChat = addPrivateChat(chat.id, userId, userDestinyId)
                                sendMessage(privateChat, socket, socketId, message, nickname, receivedNickname)
                            })
                        } else {
                            privateChat = addPrivateChat(chat.id, userId, userDestinyId)
                            sendMessage(privateChat, socket, socketId, message, nickname, receivedNickname)
                        }
                    })
            }
            if (privateChat) {
                sendMessage(privateChat, socket, socketId, message, nickname, receivedNickname)
            }
            async function sendMessage(privateChat, socket, socketId, message, nickname, receivedNickname) {
                await chatPrivateRoom
                    .find({ _id: privateChat.chatId })
                    .where('messages')
                    .sort({ fullDate: 'desc' })
                    .limit(1)
                    .exec(async (err, chat) => {
                        if (err) {
                            console.log(err)
                        }
                        if (chat[0]) {
                            const trueDate = chat[0].messages[0] === undefined || chat[0].messages[chat[0].messages.length - 1].fullDate.getDate() !== t.getDate()
                            if (trueDate) {
                                const newDateSystem = {
                                    nickname,
                                    systemDate: dateHelpers.dateDDMMYYYY(t),
                                    receivedNickname
                                }
                                chat[0].messages.push(newDateSystem)

                                socket.emit(userDestinyId, newDateSystem)
                                    if (socketId !== undefined) {
                                        socket.broadcast.to(socketId).emit(userId, newDateSystem)
                                    }
                            }
                            const newMessage = {
                                message,
                                nickname,
                                created_at: dateHelpers.timeTwoDigits(t),
                                receivedNickname
                            }
                            chat[0].messages.push(newMessage)
                            chat[0].save( (err, message) => {
                                if (err) {
                                    console.log(err)
                                }
                                if (message) {
                                    socket.emit(userDestinyId, newMessage)
                                    console.log('aca')
                                        if (socketId !== undefined) {
                                                socket.broadcast.to(socketId).emit
                                                (userId, newMessage)
                                                // Cast Signal to open new Tab
                                                socket.broadcast.to(socketId).emit
                                                (userDestinyId, userId)
                                                console.log('acaTambien')
                                        }
                                }
                            })
                        }
                    })
            }
        }
    })

    // TYPING
    socket.on('typing', (data) => {
        const user = getUserOnlineByNickname(data.userDestiny.nickname)
        if(user) {
            socket.broadcast.to(user.socketId).emit('userTyping', data)
        }
    })
}