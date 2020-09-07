const express = require('express'),
    router = express.Router(),
    chatPrivateRoom = require('../../models/privateChatMessage'),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials'),
    { getUserOnlineById } = require('../../chat/users')

router.delete('/', ensureAuthenticated, async (req, res) => {
    let io = req.app.get('socketio')
    const userId = req.user.id,
        idMessage = req.query._id,
        currentUser = req.query.userRecievedId,
        {socketId} = getUserOnlineById(userId)
        userDestiny = getUserOnlineById(currentUser)

    await chatPrivateRoom
        .updateOne({
            $or: [
                { $and: [{ userId: currentUser }, { userIdTwo: userId }] },
                { $and: [{ userId }, { userIdTwo: currentUser }] }
            ]
        }, { $pull: { messages: { _id: req.query._id } } }, async (err, messages) => {
            if (err) {
                return res.status(500).json({
                    message: err || "No se pudo recuperar los mensajes del chat"
                })
            }
            if (messages) {
                await chatPrivateRoom
                    .findOne({
                        $or: [
                            { $and: [{ userId: currentUser }, { userIdTwo: userId }] },
                            { $and: [{ userId }, { userIdTwo: currentUser }] }
                        ]
                    })
                    .exec(async (err, response) => {
                        if (err) {
                            return res.status(500).json({
                                message: err || "No se pudo recuperar los mensajes del chat"
                            })
                        }
                        if (response) {
                            const collection = response.messages
                            let pages = undefined
                            let deletedMessagesIds = [idMessage]
                            const deleteSystemDate = collection[collection.length - 1].systemDate !== null
                            if (deleteSystemDate) deletedMessagesIds.push(collection[collection.length - 1].id)
                            const difference = deleteSystemDate
                                ? (collection.length - 1) % 15
                                : collection.length % 15
                            if (difference !== 0) {
                                pages = deleteSystemDate
                                    ? (Math.floor((collection.length - 1) / 15)) + 1
                                    : (Math.floor(collection.length / 15)) + 1
                            } else {
                                pages = deleteSystemDate
                                    ? (collection.length - 1) / 15
                                    : collection.length / 15
                            }
                            if (deleteSystemDate) {
                                await chatPrivateRoom.deleteOne({ _id: collection[collection.length - 1].id })
                            }
                            if(userDestiny) {
                                const userDestinySocket = userDestiny.socketId
                            io.to(userDestinySocket).emit('deletedMessagePrivate', { deletedMessagesIds, pages, difference })
                            }
                            io.to(socketId).emit('deletedMessagePrivate', { deletedMessagesIds, pages, difference })
                            return res.send('El mensaje ya fue borrado')
                        }
                    })
                if (!messages) {
                    return res.json('El mensaje ya fue borrado')
                }
            }
        })
})

module.exports = router