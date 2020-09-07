
let users = [],
  user = {},
  privateChats = [],
  openTabs = []

const currentTabs = (openChats, nickname) => {
  if (nickname !== '') {
    const index = openTabs.findIndex(el => el.nickname === nickname)
    if (index === -1) {
      const tabs = {
        nickname: nickname,
        openChats: openChats
      }
      openTabs.push(tabs)
    } else {
      openTabs[index].openChats = openChats
    }
  }
}

const getCurrentTabs = nickname => {
  const tabs = openTabs.find((el) => el.nickname === nickname)
  if (tabs === undefined) {
    return { openChats: [] }
  } else {
    return tabs
  }
}

const actualUSer = (nickname, profilePictureLocation, socketId, _id) => {
  user.nickname = nickname
  user.profilePictureLocation = profilePictureLocation
  user.socketId = socketId
  user.userId = _id
  addUser(user)
}

const addUser = ({ nickname, profilePictureLocation, socketId, userId }) => {
  const checkUser = users.map(user => {
    return user.nickname
  }).indexOf(nickname)
  if (checkUser === -1) {
    const user = { nickname, profilePictureLocation, socketId, userId }
    users.push(user)
    return { user }
  } else {
    users[checkUser].socketId = socketId
  }
}

const removeUser = userId => {
  const index = users.findIndex(user => user.userId === userId)

  if (index !== -1) return users.splice(index, 1)[0]
}

const removeUserBySocketId = socketId => {
  const index = users.findIndex(user => user.socketId === socketId)
  if (index !== -1) return users.splice(index, 1)[0]
}

const getUser = nickname => {
  const user = users.find(user => user.nickname === nickname)
  return user
}

const getUsersInRoom = () => users

const getUserOnlineByNickname = nickname => {
  const userDestiny = users.find(user => user.nickname === nickname)
  return userDestiny
}

const getUserOnlineById = id => {
  const userDestiny = users.find(user => user.userId === id)
  return userDestiny
}

const addPrivateChat = (chatId, userId, userIdTwo) => {
  const chat = {
    chatId,
    userId,
    userIdTwo
  }
  privateChats.push(chat)
  return chat
}

const getPrivateChat = (userId, userIdTwo) => {
  const chat = privateChats.find(el => {
    if (el.userId === userId && el.userIdTwo === userIdTwo) {
      return true
    } else {
      if (el.userIdTwo === userId && el.userId === userIdTwo) {
        return true
      } else {
        return false
      }
    }
  })
  return chat
}
module.exports = { actualUSer, addUser, removeUser, removeUserBySocketId, getUser, getUsersInRoom, getUserOnlineByNickname, getUserOnlineById, addPrivateChat, getPrivateChat, currentTabs, getCurrentTabs }