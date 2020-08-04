const express = require('express'),
    router = express.Router(),
    Dojos = require('../../models/dojos'),
    config = require('../../config/config')

router.post('/', async (req, res) => {

    const { password, dojoName } = req.body

    if (password === config.SUPER_ADMIN_KEY) {

        await Dojos.findOneAndRemove({dojoName}, (err, data) => {
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