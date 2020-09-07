const express = require('express'),
    router = express.Router(),
    Dojos = require('../../models/dojos'),
    config = require('../../config/config'),
    { validateSuperAdmin } = require('../../middlewares/validation/validateCredentials')

router.post('/', validateSuperAdmin, async (req, res) => {

        const newDojo = new Dojos({
            dojoName
        })
        await newDojo.save((err, data) => {
            if (err) {
                return res.send(err)
            }
            if (data) {
                return res.send(data)
            }
        })
})
module.exports = router