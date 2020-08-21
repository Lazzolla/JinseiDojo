import React, { Fragment, useState, useEffect, useContext } from 'react'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { uuid } from 'uuidv4'
import GralRoom from './Windows/GralRoom'
import UsersConnected from './UsersConnected'
import PrivateChat from '../Chat/Windows/PrivateChat'
import ButtonDinamic from '../ButtonDinamic'
import Notifications from './Windows/Notifications'
import { GralContext, socket } from '../../App'
import './lobby.css'

export default function Lobby() {
    const context = useContext(GralContext)
    // const [newMessage, setNewMessage] = useState(null)
    const [users, setUsers] = useState([])
    const [openChats, setOpenChats] = useState([])
    const [chatGlobalTitle, setChatGlobalTitle] = useState('Sala de Instructores')
    const [showGralChat, setShowGralChat] = useState(true)
    const [gralChatRoom, setGralChatRoom] = useState('inline')
    const [instChatRoom, setInstChatRoom] = useState('none')

    // LISTEN FOR ONLINE USERS AND  LOAD CURRENT TABS FROM SERVER

    useEffect(() => {
        if (context.state.user.isAuthenticated) {

            socket.on('usersOnline', ({ users }) => {
                setUsers(users)
            })
            socket.on('loadOpenTabs', ({ openTabs }) => {
                setOpenChats([...openTabs.openChats])
            })
        } else {
            setUsers([])
            setOpenChats([])

        }
    }, [context.state.user.isAuthenticated])

    const openNewTab = async (user) => {
        if (user.nickname !== context.state.user.nickname) {
            const ind = openChats.findIndex((el) => el.nickname === user.nickname)
            if (ind === -1) {
                user.userKey = uuid()
                user.messages = []
                setOpenChats(prevState => {
                    prevState.map(el => el.display = 'none')
                    user.display = 'block'
                    return [...prevState, user]
                })
            }
        }
    }

    useEffect(() => {
        if (context.state.user.isAuthenticated) {
            socket.on(context.state.user._id, (data) => {
                const ind = openChats.findIndex(el => el.userId === data)
                if (ind === -1) {
                    const userTab = users.find(el => el.userId === data)
                    openNewTab(userTab)
                }
            })
        }
        return () => {
            socket.off(context.state.user._id)
        }
        //PREVENT WARNING FROM MISSING DEPENDECIES FOR FIELDS IN FETCH FUNCTION AND SCROLL POSITION
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, openChats, context.state.user.isAuthenticated])

    useEffect(() => {
        if (context.state.user.nickname) {
            const nickname = context.state.user.nickname,
                usersTabs = openChats
            socket.emit('currentTabs', { usersTabs, nickname })
        }
    }, [openChats, context.state.user.nickname])

    const closeTab = (idTab) => {
        const ind = openChats.findIndex(el => el.userKey === idTab)
        const newAr = openChats.filter(el => el.userKey !== idTab)
        if (ind === 0) {
            if (newAr.length > 0) {
                newAr[0].display = 'block'
            }
        } else {
            openChats[ind - 1].display = 'block'
        }
        setOpenChats([...newAr])
    }

    const selectActive = (event) => {
        const idTab = event.target.id
        const ind = openChats.findIndex(el => el.userKey === idTab)
        setOpenChats(prevState => {
            prevState.map(el => el.display = 'none')
            prevState[ind].display = 'block'
            prevState[ind].unReaded = 0
            return [...prevState]
        })
    }

    const changeChatGlobal = () => {
        if (gralChatRoom === 'inline') {
            setChatGlobalTitle('Sala General')
            setInstChatRoom('inline')
            setGralChatRoom('none')

        } else {
            setChatGlobalTitle('Sala de Instructores')
            setGralChatRoom('inline')
            setInstChatRoom('none')

        }
    }

    const openCloseChat = (action) => {
        setShowGralChat(action)
    }

    const newUnreadMessage = (userDestinyId) => {
        const index = openChats.findIndex(el => el.userId === userDestinyId)
        if (openChats[index].display === 'none') {
            // openChats[index].unReaded += 1
            setOpenChats(prevState => {
                const newArray = prevState
                newArray[index].unReaded = 0
                newArray[index].unReaded += 1
                return [...newArray]
            })
        }
    }

    const showLobby = showGralChat
        ? <div className="lobby-gral">
            <div className="chat-lobby-rooms h5  text-center">
                {context.state.user.isInstructor && context.state.user.dataValidation
                    ? <ButtonDinamic
                        onClick={() => changeChatGlobal()}
                        buttonText={chatGlobalTitle}
                        stylePrimaryText="chat-lobby-rooms-button-text"
                    />
                    : null}
            </div>
            <div
                type="button"
                onClick={() => openCloseChat(false)}
                className="lobby-gral-close"
            >
                <FontAwesomeIcon
                    className="lobby-gral-close-icon"
                    type="button" icon={faCaretRight}
                    size='3x'
                    onClick={() => openCloseChat(false)}
                />
            </div>

            <Container>
                <GralRoom
                    room='gralRoom'
                    display={gralChatRoom}
                    inputId="input_gralRoom"
                    title='Sala General'
                    gralClasses="chat-gral"
                    classNameBody='chat-gral-body'
                    emitAndOn='gralRoom'
                    emitTyping='typingGralRoom'
                    onDeletedMessage="gralRoomMessageDeleted"
                    onTyping='gralRoomTyping'
                    messagesURL='gralmessages'
                    id='gralRoomMessages'
                />
                {context.state.user.isInstructor
                    ? <GralRoom
                        room='instRoom'
                        display={instChatRoom}
                        inputId="input_instRoom"
                        title='Sala de Instructores'
                        gralClasses="chat-gral"
                        classNameBody='chat-inst-body'
                        emitAndOn='instRoom'
                        emitTyping='typingInstRoom'
                        onDeletedMessage="instRoomMessageDeleted"
                        onTyping='instRoomTyping'
                        messagesURL='instmessages'
                        id='instRoomMessages'
                    />
                    : null}
            </Container>
            <div
                className="lobby-notifications-gral"
            >
                <Notifications
                    openNewTab={openNewTab}
                    openChats={openChats}
                />
            </div>
            <div
                className="lobby-users-connected-wrapper"
            >
                <div
                    className="lobby-users-connected"
                >
                    <UsersConnected
                        users={users}
                        openNewTab={openNewTab}
                    />
                </div>
            </div>
        </div>
        : <div
            type="button"
            onClick={() => openCloseChat(true)}
            className="lobby-gral-open rounded-pill"
        >
            <FontAwesomeIcon
                className="lobby-gral-open-icon"
                type="button"
                icon={faCaretLeft}
                size='3x'
                onClick={() => openCloseChat(true)}
            />
        </div>
    return (
        context.state.user.isAuthenticated
      ?  <div
            className={showGralChat
                ? openChats.length > 0
                    ? "lobby-chatGralComponent"
                    : "lobby-chatGralComponent-without-privateChat"
                : openChats.length > 0
                    ? "lobby-chatGralComponent-close-with-privateChat"
                    : "lobby-chatGralComponent-close-without-privateChat"

            }
        >
            {showLobby}
            <div
                className={showGralChat
                    ? openChats.length > 0
                        ? "private-chat-gral-wrapper"
                        : "private-chat-gral-wrapper-empty"
                    : openChats.length > 0
                        ? "private-chat-gral-wrapper-onClose"
                        : "private-chat-gral-wrapper-onClose-empty"}
            >
                <div
                    className={openChats.length > 0
                        ? "pictures-private-chat-container"
                        : null}
                >
                    <div
                        className="pictures-group"
                    >
                        {openChats.map((user, y) => (
                            <Fragment
                                key={y}
                            >
                                <Image
                                    type="button"
                                    id={user.userKey}
                                    onClick={(e) => selectActive(e)}
                                    className="pictures-private-chat"
                                    roundedCircle={true}
                                    fluid={true}
                                    src={user.profilePictureLocation}
                                />
                                <Badge
                                    className={user.unReaded > 0
                                        ? "lobby-picture-badge"
                                        : "lobby-picture-badge-off"
                                    }
                                    id={user.userKey}
                                    variant="danger"
                                    pill
                                >
                                    {user.unReaded}
                                </Badge>
                            </Fragment>
                        ))}
                    </div>
                </div>
                <div
                    className="chat-private-tab-container"
                >
                    {openChats.map((user, x) => (
                        <div
                            key={x}
                            className="chat-private-tab"
                            style={{ display: user.display }}
                        >
                            <PrivateChat
                                user={user}
                                idTab={user.userKey}
                                inputId={user.userId}
                                closeTab={closeTab}
                                newUnreadMessage={newUnreadMessage}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        : null
    )
}
