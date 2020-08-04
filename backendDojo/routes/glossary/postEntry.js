const users = require('../../chat/users')

const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry')



router.post('/', async (req, res) => {

    const password = req.body.password

    const superAdminKey = "%*k7-2t.N{?MS3}zTmx:-^-8Hh(c`9N<]}p4$vW?,'`-`W`S9cJ?B04OD[WtHHq"

    if (password === superAdminKey) {

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