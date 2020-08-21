const express = require('express'),
    router = express.Router(),
    user = require('../../models/User'),
    { getUserOnlineById } = require('../../chat/users')

module.exports = {
    async validateInstructor(req, res, next) {

        let io = req.app.get('socketio')

        await user.findOne({ _id: req.user._id }, (err, user) => {
            if (err) {
                return res.status(500).json({
                    message: err || "No se pudo recuperar los mensajes del chat"
                })
            }
            if (user) {
                if (user.isInstructor === true) {
                    next()
                } else {
                    req.logOut()
                    req.session = null
                    req.sessionOptions.maxAge = 0
                    res.status(401).json({ message: 'No estas autorizado para ver este chat' })
                    setTimeout(() => {
                        const { socketId } = getUserOnlineById(user.id)
                        io.to(socketId).emit('forceLogOut', 'You are OUT')
                    }, 3000)
                }

            }
        })
    }
}