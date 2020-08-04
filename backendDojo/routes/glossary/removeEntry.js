const users = require('../../chat/users')

const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry')



router.delete('/', async (req, res) => {

    const password = req.body.password
    const superAdminKey = "%*k7-2t.N{?MS3}zTmx:-^-8Hh(c`9N<]}p4$vW?,'`-`W`S9cJ?B04OD[WtHHq"

    if (password === superAdminKey) {

           await GlossaryEntry
           .findOneAndUpdate({_id: req.body.id}, {$pull: {entries: { title: req.body.title}}}, {new:true}, (err, entry) => {
            if(err) {
                res.status(500).json({message: err})
            }
            if(entry) {
                res.send(entry)
            }
            })
    }
})

module.exports = router