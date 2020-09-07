const express = require('express'),
    router = express.Router(),
    UserExamProgram = require('../../models/UserExamProgram'),
    { ensureAuthenticated, checkGralValidation } = require('../../middlewares/validation/validateCredentials')

router.post('/', ensureAuthenticated, checkGralValidation, async (req, res) => {
    const id = req.user.id
    const { title, selectedFields } = req.body
    
    await UserExamProgram.findOne({ title: title, userId: id }, async (err, exam) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, something happened"
            })
        }
        if (exam) {
            exam.techniques = selectedFields
            await exam.save((err, exam) => {
                if (err) {
                    return res.status(500).json({
                        message: err || "Ooops, something happened"
                    })
                }
                if(exam) {
                    return res.status(200).json({message: "Programa Actualizado con exito"})
                }
            })
        }
        if(!exam) {
            const newProgram = new UserExamProgram({
                userId: id,
                title,
                techniques: selectedFields
            })
            await newProgram.save((err, exam) => {
                if (err) {
                    return res.status(500).json({
                        message: err || "Ooops, something happened"
                    })
                }
                if(exam) {
                    return res.status(200).json({message: "Programa guardado con exito"})
                }
            })
        }
    })
})

module.exports = router