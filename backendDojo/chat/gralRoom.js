const chatGralRoom = require('../models/chatMessage'),
    instGralRoom = require('../models/instMessage'),
dateHelpers = require('../helpers/dates')

module.exports = function (io, socket) {

// GENERAL CHAT
    socket.on('gralRoom', async (data) => {
        manageMessage(data, chatGralRoom, 'gralRoom')
    })

    // INSTRUCTORS CHAT
    socket.on('instRoom', async (data) => {
        manageMessage(data, instGralRoom, 'instRoom')
    })

    // TYPING
    socket.on('typingGralRoom', (data) => {
        io.emit('gralRoomTyping', data)
    })

    socket.on('typingInstRoom', (data) => {
        io.emit('instRoomTyping', data)
    })

   async function manageMessage(data, chatModel, emit) {
        const { message, nickname } = data
        const t = new Date()
        if (message.length > 0) {
            await chatModel.find().sort({ fullDate: 'desc' }).limit(1).exec(async (err, chat) => {
                const trueDate = chat[0] === undefined || chat[0].fullDate.getDate() !== t.getDate()
                if (trueDate) {
                    newDateSystem = new chatModel({
                        systemDate: dateHelpers.dateDDMMYYYY(t),
                    })
                    await newDateSystem.save(async (err, message) => {
                        io.emit(emit, message)
                        sendMessage()
                    })
                } else {
                    sendMessage()
                }
            })
        }
        const sendMessage = async () => {
            const newMessage = new chatModel({
                message,
                nickname,
                created_at: dateHelpers.timeTwoDigits(t)
            })
            await newMessage.save((err, message) => {
                if (message) {
                    io.emit(emit, message)
                }
            })
        }
    }
}
