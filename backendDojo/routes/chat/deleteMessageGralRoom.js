const express = require('express'),
    router = express.Router(),
    chatGralRoom = require('../../models/chatMessage'),
    instGralRoom = require('../../models/instMessage'),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials')

router.delete('/', ensureAuthenticated, async (req, res) => {
    let io = req.app.get('socketio')
    const idMessage = req.query._id,
        currentRoom = req.query.room
    const chatModel = currentRoom === 'gralRoom'
        ? chatGralRoom
        : instGralRoom
    const emit = currentRoom === 'gralRoom'
        ? 'gralRoomMessageDeleted'
        : 'instRoomMessageDeleted'
        
    await chatModel.deleteOne({ _id: idMessage }, async (err, response) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, paso algo malo"
            })
        }
        if (response) {

            await chatModel
                .find()
                .exec(async (err, collection) => {
                    if (err) {
                        return res.status(500).json({
                            message: err || "No se pudo recuperar los mensajes del chat"
                        })
                    }
                    if (collection) {
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
                            await chatModel.deleteOne({ _id: collection[collection.length - 1].id })
                        }
                        io.emit(emit, { deletedMessagesIds, pages })
                        return res.send('El mensaje ya fue borrado')
                    }
                })
        }
        if (!response) {
            return res.send('El mensaje ya fue borrado')
        }
    })
})

module.exports = router