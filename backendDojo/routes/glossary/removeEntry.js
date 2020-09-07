const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry'),
    config = require('../../config/config'),
    { validateSuperAdmin } = require('../../middlewares/validation/validateCredentials')

router.delete('/', validateSuperAdmin, async (req, res) => {

    await GlossaryEntry
        .findOneAndUpdate({ _id: req.body.id }, { $pull: { entries: { title: req.body.title } } }, { new: true }, (err, entry) => {
            if (err) {
                res.status(500).json({ message: err })
            }
            if (entry) {
                res.send(entry)
            }
        })
})

module.exports = router