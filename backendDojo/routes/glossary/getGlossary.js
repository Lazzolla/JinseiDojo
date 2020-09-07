const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry'),
    { ensureAuthenticated, checkGralValidation } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, checkGralValidation, async (req, res) => {

    await GlossaryEntry.find((err, entries) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, paso algo malo"
            })
        }
        if (entries) {
            return res.json(entries)
        }
    })
})

module.exports = router