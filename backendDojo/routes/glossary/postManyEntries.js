const users = require('../../chat/users')

const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry'),
    config = require('../../config/config')



router.post('/', async (req, res) => {

    const password = req.body.password
    
    if (password === config.SUPER_ADMIN_KEY) {

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