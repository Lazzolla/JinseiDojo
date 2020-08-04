const express = require('express'),
  router = express.Router(),
  Instructor = require('../../models/Instructor')

router.get('/',  async (req, res) => {
    
    await Instructor
                .find()
                .where('validated')
                .equals(true)
                .exec((err, data) => {
                    return res.send(data)
                })


})

module.exports = router