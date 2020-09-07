const express = require('express'),
    router = express.Router()

router.use('/gralmessages', require('./gralMessages'))
    .use('/instmessages', require('./instMessages'))
    .use('/getprivatemessages', require('./getPrivateMessages'))
    .use('/getofflinenotifications', require('./getOfflineNotifications'))
    .use('/deletenotifications', require('./deleteNotifications'))
    .use('/deletemessagegralroom', require('./deleteMessageGralRoom'))
    .use('/deletemessageprivateroom', require('./deleteMessagePrivateRoom'))

module.exports = router
