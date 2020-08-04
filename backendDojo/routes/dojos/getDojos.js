const express = require('express'),
  router = express.Router(),
  Dojos = require('../../models/dojos')

router.get('/', async (req, res) => {
    
    await Dojos
                .find()
                .exec((err, data) => {
                    return res.send(data)
                })
})


module.exports = router