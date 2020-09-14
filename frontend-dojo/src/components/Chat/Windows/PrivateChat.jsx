import React, { useState, useEffect, useContext, useRef, useCallback, Fragment } from 'react'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { GralContext, socket } from '../../../App'
import Message from '../Message'
import ModalAlert from '../../ModalAlert'
import ShowProfile from '../../ShowProfile'
import Input from '../../Input'
import '../lobby.css'
import './gralRoom.css'
import './privateChat.css'
import '../../../index.css'

export default function PrivateChat(props) {
    const context = useContext(GralContext)

    const modalUserRef = useRef()
    const observer = useRef()

    const [userDestiny, setUserDestiny] = useState(null)
    const [nickname, setNickname] = useState('')
    const [messages, setMessages] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [typing, setTyping] = useState('')
    const [lastUpdateTime, setLastUpdateTime] = useState('')
    const [loading, setLoading] = useState(true)
    const [pageMessages, setPageMessages] = useState(1)
    const [pagesAvailable, setPagesAvailable] = useState(0)
    const [differencePages, setDifferencePages] = useState(0)
    const [bodyTag, setBodyTag] = useState(null)
    const [prevHeightBody, setPrevHeightBody] = useState(0)
    const [fetching, setFetching] = useState('')

    const firstMessageRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async entries => {
            if (entries[0].isIntersecting) {
                setPageMessages(prevState => {
                    if (prevState !== 1) {
                        return prevState + 1
                    } else {
                        return 2
                    }
                })
            }
        })
        if (node) observer.current.observe(node)
    }, [loading])

    useEffect(() => {
        setUserDestiny(props.user)
        setNickname(context.state.user.nickname)
        setIsTyping('')
    }, [context, props])

    useEffect(() => {
       
        socket.on('deletedMessagePrivate', data => {
            setMessages(prevState => {
                data.deletedMessagesIds.forEach(el => {
                    const ind = prevState.findIndex(msg => msg._id === el)
                    prevState.splice(ind, 1)
                })
                return [...prevState]
            })
            setPagesAvailable(data.pages)
            setDifferencePages(data.difference)
        })
    }, [])

    useEffect(() => {
        if(userDestiny) {
        socket.on(userDestiny.userId, ({
            nickname,
            message = null,
            systemDate = null,
            created_at,
            receivedNickname }) => {
            const newMessage = systemDate === null
                ? { nickname, receivedNickname, message, created_at }
                : { nickname, receivedNickname, systemDate, created_at }
                setMessages(prevState => {
                    return [...prevState, newMessage]
                })
                props.newUnreadMessage(userDestiny.userId)
        })
    }
            //PREVENT WARNING FROM MISSING DEPENDECIES FOR FIELDS IN FETCH FUNCTION AND SCROLL POSITION
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDestiny])

    useEffect(() => {
        if (bodyTag) {
            bodyTag.scrollTop = bodyTag.scrollHeight
        }
    }, [messages, props.user.display, bodyTag])

    useEffect(() => {
        async function getMessages() {
            setLoading(true)
            try {
                setFetching('Cargando...')
                setTimeout(() => {
                    setFetching('')
                }, 2000)
                const { data } = await axios.get(`api/chat/getprivatemessages?userId=${userDestiny.userId}&page=${pageMessages}&differencePages=${differencePages}&totalPages=${pagesAvailable}`, { withCredentials: true })
                setMessages(prevState => {
                    return [...data.OrderedMessages, ...prevState]
                })
                setDifferencePages(data.difference)
                setFetching('')
                if (pageMessages !== 0) {
                    const scrollFluid = bodyTag.scrollHeight % prevHeightBody === 0
                        ? bodyTag.scrollHeight % prevHeightBody
                        : prevHeightBody
                    bodyTag.scrollTo(0, scrollFluid)
                } else {
                    setPagesAvailable(data.pages)
                    bodyTag.scrollTop = bodyTag.scrollHeight
                    setPrevHeightBody(bodyTag.scrollHeight)
                }
                setLoading(false)
            } catch (err) {
                setFetching('')
                setLoading(false)
                console.log(err.response)
            }
        }
        if (userDestiny) {
            if (!bodyTag) {
                setBodyTag(document.getElementById(userDestiny.userId))
                setPageMessages(0)
            }
            if (bodyTag) {
                if (pageMessages < pagesAvailable || pagesAvailable === 0) getMessages()
            }
        }
        //PREVENT WARNING FROM MISSING DEPENDECIES FOR FIELDS IN FETCH FUNCTION AND SCROLL POSITION
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageMessages, userDestiny, bodyTag])

    useEffect(() => {
        if (userDestiny) {
            socket.on('userTyping', ({ nickname, clearTyping = null }) => {
                setTimeout(() => {
                    setTyping('')
                }, 5000)
                if (nickname === userDestiny.nickname) {
                    clearTyping === null
                        ? setTyping(nickname + ' esta escribiendo...')
                        : setTyping('')
                }
            })
        }
    }, [userDestiny])

    const sendMessage = message => {
        if (message) {
            const receivedUser = {
                receivedNickname: userDestiny.nickname,
                userDestinyId: userDestiny.userId
            }
            const userId = context.state.user._id
            const data = { userId, nickname, message, receivedUser }
            socket.emit('message', data)
        }
    }

    const sendTyping = () => {
        setLastUpdateTime(Date.now())
        socket.emit('typing', { nickname, userDestiny })
        if (!isTyping) {
            let typingInterval = setInterval(() => {
                if ((Date.now() - lastUpdateTime) > 1500) {
                    setIsTyping(false)
                    const clearTyping = true
                    socket.emit('typing', { nickname, clearTyping, userDestiny })
                    clearInterval(typingInterval)
                }
            }, 300)
        }
        setIsTyping(true)
    }

    return (
        userDestiny
            ? <Fragment>
                <Card className="chat-private-window rounded">
                    <Card.Header className="chat-private-title">
                        <div
                            type="button"
                            className="chat-private-title-name"
                            onClick={() => modalUserRef.current.show()}
                        >
                            {userDestiny.nickname}
                        </div>
                        <div className="chat-private-closeBut">
                            <FontAwesomeIcon
                                className="close-chat-icon"
                                type="button"
                                icon={faTimes}
                                size='lg'
                                onClick={() => props.closeTab(props.idTab)}
                            />
                        </div>
                    </Card.Header>
                    <div className="rounded-pill chat-private-fetching">
                        {fetching}
                    </div>
                    <Card.Body
                        id={userDestiny.userId}
                        className="chat-private-body"
                    >
                        {messages.map((message, i) => {
                            if (i !== 0) {
                                return <div key={i}>
                                          <Message
                                              userRecievedId={userDestiny.userId}
                                              deleteURL="deletemessageprivateroom"
                                              iconClass="message-private"
                                              message={message}
                                          />
                                       </div>
                            } else {
                                return <div ref={firstMessageRef} key={i}>
                                          <Message
                                              userRecievedId={userDestiny.userId}
                                              deleteURL="deletemessageprivateroom"
                                              iconClass="message-private"
                                              message={message}
                                          />
                                       </div>
                            }
                        })}
                    </Card.Body>
                    <div className="rounded-pill private-chat-typing">
                        {typing}
                    </div>
                    <Card.Footer className="private-chat-footer">
                        <Row>
                            <Col className="p-0">
                                <Input
                                    disabled={loading}
                                    id={props.inputId}
                                    placeholderInput="Escribí un mensaje aca..."
                                    sendTyping={sendTyping}
                                    onKeyPressInput={sendMessage}
                                    classnameInput="chat-private-textarea"
                                    classnameEmojiIconDiv="private-emojiPickerDiv"
                                    classNamePaperPlane="paperPlane-privateRoom"
                                    classNameModalPicker="modal-chat-private"
                                />
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
                {/* MODAL USER */}
                <ModalAlert
                    ref={modalUserRef}
                    dialogClassName="pubBoard-modalUser"
                    customStyles="pubBoard-modalUserCustom"
                    backdrop={true}
                    size="lg"
                    title={userDestiny.nickname}
                >
                    <ShowProfile
                        user={userDestiny.nickname}
                    />
                </ModalAlert>
            </Fragment>
            : null
    )
}
