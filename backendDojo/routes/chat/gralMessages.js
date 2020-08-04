const express = require('express'),
    router = express.Router(),
    chatMessage = require('../../models/chatMessage'),
    ensureAuthenticated = require('../../passport/ensureAuth')



router.get('/:page', ensureAuthenticated, async (req, res) => {

    const page = req.params.page
    await chatMessage.find()
    .sort({ _id: -1 })
    .skip(15*page)
    .limit(15)
        .exec( async (err, messages) => {
            if (err) {
                return res.status(500).json({
                    message: err || "No se pudo recuperar los mensajes del chat"
                })
            }
            if (messages) {
                await chatMessage.countDocuments({}, (err, count) => {
                    if (err) {
                        return res.status(500).json({
                            message: err || "No se pudo recuperar los mensajes del chat"
                        })
                    }
                    let pages = undefined
                    const difference = count % 15
                    if(difference !== 0) {
                        pages = (Math.floor(count/15)) + 1
                    } else {
                        pages = count/15
                    }
                    const OrderedMessages = messages.reverse()
                    return res.json({OrderedMessages, pages})
                })
            }
        })
})

module.exports = router