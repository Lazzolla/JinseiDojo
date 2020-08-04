const express = require('express'),
  router = express.Router(),
  ensureAuthenticated = require('../../passport/ensureAuth'),
  InstructorVideos = require('../../models/InstructorVideos')

router.put('/', ensureAuthenticated , async (req, res) => {
    
    const videos = req.body.links

    await InstructorVideos.findOneAndUpdate({userId: req.user.id}, {videos}, {new: true}, async (err, data) => {
        if(err) {
            res.status(500).json({message: err})
        }
        if(data) {
            res.send(data)
        }
        if(!data) {
           const newInstVideos = new InstructorVideos({
            userId: req.user.id,
            videos
           })
           await newInstVideos.save((err, data) => {
            if(err) {
                res.status(500).json({message: err})
            }
            if(data) {
                res.send(data)
            }
           })
        }
    })



})

module.exports = router