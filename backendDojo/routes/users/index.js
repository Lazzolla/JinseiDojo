const express = require('express')
const router = express.Router()


router.use('/signup', require('./signup'))
    .use('/login', require('./login'))
    .use('/logout', require('./logout'))
    .use('/updateuser', require('./updateUser'))
    .use('/updatepassword', require('./updatePassword'))
    .use('/getuser', require('./getUser'))
    .use('/getuserbynickname', require('./getUserByNickname'))
    .use('/getusersoffline', require('./getUsersOffline'))
    .use('/nicknameexist', require('./nicknameExist'))



module.exports = router
