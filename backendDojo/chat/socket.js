const { actualUSer, getUsersInRoom, removeUser, removeUserBySocketId, currentTabs, getCurrentTabs } = require('./users')

let timmer

module.exports = function (io) {
         io.on('connection', (socket) => {
        // USERS ONLINE
        socket.emit('connectionReady', 'ready')
        socket.on('online', (data = null) => {
            if (data !== null) {
                clearTimeout(timmer)
                const { nickname, profilePictureLocation, _id } = data
                let socketId = socket.id
                actualUSer(nickname, profilePictureLocation, socketId, _id)

                const users = getUsersInRoom()
                io.emit('usersOnline', { users })
                const openTabs = getCurrentTabs(nickname)
                socket.emit('loadOpenTabs', { openTabs })
            }
        })

        socket.on('disconnect', function () {
            timmer = setTimeout(() => {
                removeUserBySocketId(socket.id)
                const users = getUsersInRoom()
            io.emit('usersOnline', { users })
            }, 5000)
          })


        // LOGOUT
        socket.on('logOut', () => {
            const users = getUsersInRoom()
            io.emit('usersOnline', { users })
        })
        //  CHAT TABS OPEN   
        socket.on('currentTabs', ({ usersTabs, nickname }) => {
            currentTabs(usersTabs, nickname)
        })
        // LATEST PUBLICATIONS CHANGED
        socket.on('latestPubUpdated', () => {
            socket.broadcast.emit('latestPubUpdated', 'updated')
        })
        // NEW COMMENT IN PUBLICATION
        socket.on('newComment', (id) => {
            io.emit(id, id)
        })


        // USER UPDATED
        socket.on('userUpdate', ({user}) => {
            removeUser(user._id)
            actualUSer(user.nickname,
                user.profilePictureLocation,
                socket.id,
                user._id)
            const users = getUsersInRoom()
            socket.emit('updatedUser', 'updatedUser')
            io.emit('usersOnline', { users })
            socket.broadcast.emit('latestPubUpdated', 'updated')
        })

        // BOARD UPDATED
        socket.on('updatedBoard', () => {
            io.emit('boardUpdated', 'boardUpdated')
        })
        
        require('./gralRoom')(io, socket)
        require('./privateChat')(io, socket)

    })
}
