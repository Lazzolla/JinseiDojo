const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry'),
    config = require('../../config/config'),
    { validateSuperAdmin } = require('../../middlewares/validation/validateCredentials')

router.post('/', validateSuperAdmin, async (req, res) => {

    const newEntries = new GlossaryEntry({
        entries: req.body.entries
    })
    await newEntries.save((err, update) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, paso algo malo"
            })
        }
        if (update) {
            return res.json(update)
        }
    })
})

module.exports = router