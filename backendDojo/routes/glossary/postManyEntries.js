const users = require('../../chat/users')

const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry')



router.post('/', async (req, res) => {

    const password = req.body.password
    const superAdminKey = "%*k7-2t.N{?MS3}zTmx:-^-8Hh(c`9N<]}p4$vW?,'`-`W`S9cJ?B04OD[WtHHq"
    if (password === superAdminKey) {

        const newEntries = new GlossaryEntry({
            entries: req.body.entries
        })
            await newEntries.save( (err, update) => {
                if (err) {
                    return res.status(500).json({
                        message: err || "Ooops, paso algo malo"
                    })
                }
                if (update) {
                    return res.json(update)
                }
            })
    }
})

module.exports = router