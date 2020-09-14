import React, { useContext, useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Image from 'react-bootstrap/Image'
import Badge from 'react-bootstrap/Badge'
import { GralContext } from '../../../App'
import './notifications.css'

export default function Notifications(props) {
    const context = useContext(GralContext)

    const [notifications, setNotifications] = useState([])
    const [totalNotifications, setTotalNotifications] = useState(0)

    useEffect(() => {
        async function getNotifications() {
            try {
                const { data } = await axios.get('api/chat/getofflinenotifications', { withCredentials: true })
                setNotifications(data)
            } catch (err) {
                console.log(err.response)
            }
        }
        if (context.state.user.isAuthenticated) getNotifications()
    }, [context.state.user.isAuthenticated])

    useEffect(() => {
        const total = notifications.reduce((acc, value) => {
            acc += value.count
            return acc
        }, 0)
        setTotalNotifications(total)
    }, [notifications])

    useEffect(() => {
        async function deleteNotifications() {
            const activeChat = props.openChats.filter(chat => chat.display === 'block')
            if (activeChat.length > 0) {
                const notiUser = notifications.filter(noti => noti.id === activeChat[0].userId)
                try {
                    const userNotiId = notiUser[0].id
                    await axios.put('api/chat/deletenotifications', { userNotiId }, { withCredentials: true })
                    setNotifications(notifications.filter(noti => noti.id !== activeChat[0].userId))
                } catch (err) {
                    console.log(err.response)
                }
            }
        }
        if (props.openChats) {
            if (notifications.length > 0) {
                deleteNotifications()
            }
        }
    }, [props.openChats, notifications])

    const refreshNotifications = user => {
        user.userId = user.id
        props.openNewTab(user)
    }

    return (
        notifications.length > 0
            ? <DropdownButton
                className="notifications-main"
                variant="danger"
                title={totalNotifications}
            >
                {notifications.map((noti, key) => (
                    <Fragment key={key}>
                        <Dropdown.Item
                            onClick={() => refreshNotifications(noti.userPopulate[0])}
                            style={
                                key !== notifications.length - 1
                                    ? { borderBottom: '1px solid rgb(165, 164, 164)' }
                                    : null}
                            className={key === 0
                                ? "notifications-item-first"
                                : ((key !== notifications.length - 1) && (key > 0))
                                    ? "notifications-item-middle"
                                    : "notifications-item-last"
                            }
                        >
                            <Image
                                type="button"
                                className="notifications-image"
                                roundedCircle={true}
                                fluid={true}
                                src={noti.userPopulate[0].profilePictureLocation}
                            />
                            <p className="notifications-nickname">
                                {noti.userPopulate[0].nickname}
                            </p>
                            <Badge
                                pill
                                variant="danger"
                                className="notifications-badge"
                            >
                                {noti.count}
                            </Badge>
                        </Dropdown.Item>
                    </Fragment>
                ))}
            </DropdownButton>
            : null
    )
}
