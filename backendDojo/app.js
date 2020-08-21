const express = require('express'),
    helmet = require('helmet'),
    logger = require('morgan'),
    PORT = process.env.PORT || 8080,
    path = require('path'),
    config = require('./config/cookiesSecret'),
    passport = require('./passport'),
    cors = require('cors'),
    socketio = require('socket.io'),
    http = require('http')

require('dotenv').config()

// Routes requires
const usersRouter = require('./routes/users/index'),
    instructorRouter = require('./routes/instructor/index'),
    emailRouter = require('./routes/email/index'),
    picturesRouter = require('./routes/awsAPI/profilePicture/index'),
    blogRouter = require('./routes/blog/index'),
    chatRouter = require('./routes/chat/index'),
    examProgramRouter = require('./routes/examPrograms/index'),
    boardRouter = require('./routes/awsAPI/board/index'),
    glossaryRouter = require('./routes/glossary/index'),
    dojosRouter = require('./routes/dojos/index')

const cookieSession = require('cookie-session')

// App initialization and Socket.io init
const app = express(),
server = http.createServer(app),
io = socketio(server)

require('./chat/socket')(io)
app.set('socketio', io)

// WORK IN PROGRESS

// app.use(helmet())
// app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         "defaultSrc": ["'self'", 'unsafe-inline', 'https://maxcdn.bootstrapcdn.com', 'https://cdnjs.cloudflare.com'],
//         "scriptSrc": ["'self'", 'unsafe-inline', 'https://code.jquery.com', 'https://cdn.jsdelivr.net', 'https://stackpath.bootstrapcdn.com', 'https://www.youtube.com', 'https://s.ytimg.com'],
//         "objectSrc": ["'none'"]
//       },
//     })
//   )

// MongoDB connection
require('./database')

app.enable('trust proxy')
    .use(cookieSession({
        maxAge: 1000*60*60*24*31*36,
        name: config.COOKIES_NAME,
        keys: config.COOKIES_KEYS,
        saveUninitialized: true,
        httpOnly: true,
        secure: true,
        domain: config.COOKIES_DOMAIN,
        secret: config.COOKIES_SECRET
    }))
app.use(logger('dev'))
    .use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(express.static(path.join(__dirname, "../frontend-dojo/build")))


// Return all Routes from React Router    
app.get(['/', '/profile', '/rank', '/instructor', '/publications', '/blog'], function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend-dojo/build", 'index.html'))
})
// Return static Policy of Privacy file

app.get('/policy-of-privacy', function (req, res) {
    res.sendFile(path.join(__dirname, "./privacy", 'privacy.html'))
})

app.use(passport.initialize())
    .use(passport.session())
    // Routes urls 
    .use('/api/users', usersRouter)
    .use('/api/instructor', instructorRouter)
    .use('/api/email', emailRouter)
    .use('/api/pictures', picturesRouter)
    .use('/api/blog', blogRouter)
    .use('/api/chat', chatRouter)
    .use('/api/programs', examProgramRouter)
    .use('/api/board', boardRouter)
    .use('/api/glossary', glossaryRouter)
    .use('/api/dojos', dojosRouter)

server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
})

module.exports = app, io
