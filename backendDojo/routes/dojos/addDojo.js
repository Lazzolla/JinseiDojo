const express = require('express'),
    router = express.Router(),
    Dojos = require('../../models/dojos'),
    config = require('../../config/config')

router.post('/', async (req, res) => {

    const { password, dojoName } = req.body

    if (password === config.SUPER_ADMIN_KEY) {

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
    }
})
module.exports = router