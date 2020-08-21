const users = require('../../chat/users')

const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry'),
    config = require('../../config/config')



router.post('/', async (req, res) => {

    const password = req.body.password

    if (password === config.SUPER_ADMIN_KEY) {

        await GlossaryEntry.find(async (err, glossary) => {
            if (err) {
                return res.status(500).json({
                    message: err || "Ooops, paso algo malo"
                })
            }
            if (glossary) {
                glossary[0].entries.push({
                    title: req.body.entry.title,
                    description: req.body.entry.description,
                    category: req.body.entry.category
                })
                await glossary[0].save((err, entries) => {
                    if (err) {
                        return res.status(500).json({
                            message: err || "Ooops, paso algo malo"
                        })
                    }
                    if (entries) {
                        return res.json(entries)
                    }
                })

            }
        })
    }
})
module.exports = router