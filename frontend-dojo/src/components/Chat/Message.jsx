import React, { Fragment} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container'

import { MessageBox, SystemMessage } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import './message.css'

export default function Message({
    message: { _id, nickname = null, message = null, created_at = null,
        systemDate = null },
    iconClass,
    deleteURL,
    userRecievedId,
    room
}) {


    let isCurrentUser = false
    if (nickname !== null) {
        if (JSON.parse(window.localStorage.getItem('user')) !== null) {
            const user = JSON.parse(window.localStorage.getItem('user'))
            if (user.nickname === nickname) {
                isCurrentUser = true
            }
        }
    }

    const deleteMessage = async () => {
        const config = {
            params: {
                _id,
                room,
                userRecievedId
            },
            withCredentials: true
        }
        try {
            await axios.delete(`api/chat/${deleteURL}`, config)

        } catch (err) {
            console.log(err.response)
        }
    }

    const messageUser = isCurrentUser
        ? (
            <div>
                <MessageBox
                    position='right'
                    type='text'
                    text={message}
                    title={nickname}
                    titleColor='#bdc3c7'
                    dateString={created_at}
                />
                <FontAwesomeIcon
                    className={iconClass}
                    type="button"
                    icon={faTimes}
                    onClick={() => deleteMessage()}
                />
            </div>
        )
        : (
            <MessageBox
                position='left'
                type='text'
                text={message}
                title={nickname}
                dateString={created_at}
            />
        )

    return (
        <Fragment>
            {systemDate
                ? <SystemMessage
                    text={systemDate}
                />
                : <Container>
                    {messageUser}
                </Container>
            }
        </Fragment>
    )
}
