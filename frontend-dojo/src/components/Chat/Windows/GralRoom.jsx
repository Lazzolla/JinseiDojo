import React, { useState, useEffect, useContext, useRef, useCallback, Fragment } from 'react'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { GralContext, socket } from '../../../App'
import Message from '../Message'
import Input from '../../Input'
import '../lobby.css'
import './gralRoom.css'

export default function GralRoom(props) {
    const context = useContext(GralContext)
    const observer = useRef()
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState(null)
    const [nickname, setNickname] = useState('')
    const [profilePictureLocation, setProfilePictureLocation] = useState('')
    const [messages, setMessages] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [typing, setTyping] = useState('')
    const [lastUpdateTime, setLastUpdateTime] = useState('')
    const [pageMessages, setPageMessages] = useState(null)
    const [pagesAvailable, setPagesAvailable] = useState(1)
    const [bodyTag, setBodyTag] = useState(null)
    const [prevHeightBody, setPrevHeightBody] = useState(0)
    const [fetching, setFetching] = useState('')

    const firstMessageRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async entries => {
            if (entries[0].isIntersecting) {
                setPageMessages(prevState => {
                    if (prevState !== 0) {
                        return prevState + 1
                    } else {
                        return 1
                    }
                })
            }
        })
        if (node) observer.current.observe(node)
    }, [loading])

    useEffect(() => {
        setUserId(context.state.user._id)
        setNickname(context.state.user.nickname)
        setProfilePictureLocation(context.state.user.profilePictureLocation)
    }, [context])

    useEffect(() => {
        if (props.onDeletedMessage) {
            socket.on(props.onDeletedMessage, data => {
                setMessages(prevState => {
                    data.deletedMessagesIds.forEach(el => {
                        const ind = prevState.findIndex(msg => msg._id === el)
                        prevState.splice(ind, 1)
                    })
                    return [...prevState]
                })
                setPagesAvailable(data.pages)
            })
        }
    }, [props.onDeletedMessage])

    useEffect(() => {
        if (context.state.user.isAuthenticated) {
            if (!bodyTag) {
                setBodyTag(document.getElementById(props.id))
                setPageMessages(0)
            }
            if (bodyTag) {
                async function getMessages() {
                    setLoading(true)
                    if (pageMessages < pagesAvailable) {
                        setFetching('Cargando...')
                        try {
                            const { data } = await axios.get(`api/chat/${props.messagesURL}/${pageMessages}`, { withCredentials: true })
                            setMessages(prevState => {
                                return [...data.OrderedMessages, ...prevState]
                            })
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
                            setTimeout(() => {
                                setLoading(false)
                            }, 500)
                        } catch (err) {
                            setMessages([{ message: err.response.data.message }])
                            setLoading(false)
                            setFetching('')
                        }
                    }
                }
                getMessages()
            }
        } else {
            setMessages([])
        }
        //PREVENT WARNING FROM MISSING DEPENDECIES FOR FIELDS IN FETCH FUNCTION AND SCROLL POSITION
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageMessages, context.state.user.isAuthenticated])

    useEffect(() => {
        if (context.state.user.isAuthenticated) {
            const divTag = document.getElementById(props.id)
            socket.on(props.emitAndOn, data => {
                const message = data
                setMessages(prevState => {
                    return [...prevState, message]
                })
                divTag.scrollTop = divTag.scrollHeight
            })
        }
    }, [context.state.user.isAuthenticated, props.emitAndOn, props.id])

    useEffect(() => {
        socket.on(props.onTyping, ({ nickname, clearTyping = null }) => {
            if (nickname !== context.state.user.nickname) {
                clearTyping === null
                    ? setTyping(nickname + ' esta escribiendo...')
                    : setTyping('')
            }
        })
    }, [props.onTyping, context.state.user.nickname])

    const sendTyping = () => {
        setLastUpdateTime(Date.now())
        socket.emit(props.emitTyping, { nickname })
        if (!isTyping) {
            let typingInterval = setInterval(() => {
                if ((Date.now() - lastUpdateTime) > 1000) {
                    setIsTyping(false)
                    const clearTyping = true
                    socket.emit(props.emitTyping, { nickname, clearTyping })
                    clearInterval(typingInterval)
                }
            }, 300)
        }
        setIsTyping(true)
    }

    const sendMessage = message => {
        if (message) {
            const data = { userId, nickname, message, profilePictureLocation }
            socket.emit(props.emitAndOn, data)
        }
    }

    return (
        <Fragment>
            <Card
                className={props.gralClasses}
                style={{ display: props.display }}
            >
                <Card.Header className="chat-gral-title p-1 h5 text-center">
                    {props.title}
                </Card.Header>
                <div className="rounded-pill gralChat-fetching">
                    {fetching}
                </div>
                <Card.Body
                    id={props.id}
                    className={props.classNameBody}
                >
                    {messages.map((message, i) => {
                        if (i !== 0) {
                            return <div key={i}>
                                      <Message
                                          deleteURL='deletemessagegralroom'
                                          iconClass="message-gralRoom"
                                          room={props.room}
                                          message={message}
                                      />
                                   </div>
                        } else {
                            return <div ref={firstMessageRef} key={i}>
                                      <Message
                                          deleteURL='deletemessagegralroom'
                                          iconClass="message-gralRoom"
                                          room={props.room}
                                          message={message}
                                      />
                                   </div>
                        }
                    })}
                </Card.Body>
                <div className="rounded-pill gralChat-typing">
                    {typing}
                </div>
                <Card.Footer className="chat-gral-footer">
                    <Row>
                        <Col className="p-0">
                            <Input
                                idInput={props.inputId}
                                placeholderInput="Escribí un mensaje aca..."
                                sendTyping={sendTyping}
                                onKeyPressInput={sendMessage}
                            />
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Fragment>
    )
}