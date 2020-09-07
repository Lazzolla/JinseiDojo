const express = require('express'),
    router = express.Router(),
    user = require('../../models/User'),
    { getUserOnlineById } = require('../../chat/users'),
    { SUPER_ADMIN_KEY } = require('../../config/config')

module.exports = {
    //Check Passport login user
    ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next()
        } else {
            res.status(401).json('No tenes permisos para hacer esto, Comproba que estas logueado y volve a intentar')
        }
    },
    //Check Data Validation 
    async checkGralValidation(req, res, next) {

        let io = req.app.get('socketio')

        await user.findOne({ _id: req.user._id }, (err, user) => {
            if (err) {
                return res.status(500).json({
                    message: err || "No te conocemos."
                })
            }
            if (user) {
                if (user.dataValidation === true) {
                    next()
                } else {
                    req.logOut()
                    req.session = null
                    req.sessionOptions.maxAge = 0
                    res.status(401).json({ message: 'No estas autorizado para estar aca.' })
                    setTimeout(() => {
                        const { socketId } = getUserOnlineById(user.id)
                        io.to(socketId).emit('forceLogOut', 'You are OUT')
                    }, 3000)
                }

            }
        })
    },
    //Check Instructor Validation
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
    },
    //Check superAdmin Key
    validateSuperAdmin(req, res, next) {

        if (req.body.password === SUPER_ADMIN_KEY) return next()

        res.status(401).json({ message: "Necesitas enviar la clave para eliminar o agregar programas" })
    }
}