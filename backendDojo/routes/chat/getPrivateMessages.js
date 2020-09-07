const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    chatPrivateRoom = require('../../models/privateChatMessage'),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, async (req, res) => {
    const currentUser = req.user.id,
        { userId, page, totalPages, differencePages } = req.query
    const currentPage = parseInt(page) + 1

    messagePerPage = currentPage === parseInt(totalPages)
        ? parseInt(differencePages) === 0
            ? 15
            : parseInt(differencePages)
        : 15
    await chatPrivateRoom
        .findOne({
            $or: [
                { $and: [{ userId: currentUser }, { userIdTwo: userId }] },
                { $and: [{ userId }, { userIdTwo: currentUser }] }
            ]
        }, { messages: { $slice: [-15 * currentPage, messagePerPage] } }, async (err, messages) => {
            if (err) {
                return res.status(500).json({
                    message: err || "No se pudo recuperar los mensajes del chat"
                })
            }
            if (messages) {
                await chatPrivateRoom
                    .aggregate([
                        { $match: { _id: mongoose.Types.ObjectId(messages.id) } },
                        {
                            $project: {
                                count: { $size: "$messages" }
                            }
                        }])
                    .exec((err, response) => {
                        if (err) {
                            return res.status(500).json({
                                message: err || "No se pudo recuperar los mensajes del chat"
                            })
                        }
                        if (response) {
                            const count = response[0].count,
                                difference = count % 15
                            let pages
                            if (difference !== 0) {
                                pages = (Math.floor(count / 15)) + 1
                            } else {
                                pages = count / 15
                            }
                            return res.json({ OrderedMessages: messages.messages, pages, difference })
                        }
                    })
            }
            if (!messages) {
                return res.json({ OrderedMessages: [] })
            }
        })
})

module.exports = router