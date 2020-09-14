import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import onlineIcon from '../../pictures/onlineIcon.png'
import offlineIcon from '../../pictures/offlineIcon.png'
import './usersConnected.css'

export default function UsersConnected(props) {
    const [users, setUsers] = useState([])
    const [usersOnline, setUsersOnline] = useState([])
    const [currentSearch, setCurrentSearch] = useState([])

    useEffect(() => {
        if (props.users) {
            if (props.users.length > 0) {
                setUsersOnline(props.users)
                setCurrentSearch(props.users)
            }
        }
    }, [props.users])

    useEffect(() => {
        async function getUsersOffline() {
            const { data } = await axios.get('api/users/getusersoffline', { withCredentials: true })
            const usersData = data.map((user) => {
                let idx = usersOnline.findIndex(el => el.nickname === user.nickname)
                if (idx === -1) {
                    user.userId = user.id
                    return user
                } else {
                    return null
                }
            })
            setUsers([...usersOnline, ...usersData.filter(el => el !== null)])
        }
        if (usersOnline.length > 0) {
            getUsersOffline()
        }
    }, [usersOnline])

    const handleChange = e => {
        const { value } = e.target
        const cleanValue = value.trim()
        if (cleanValue !== '') {
            const idx = cleanValue.length
            const lowerValue = cleanValue.toLowerCase()
            const currentUsers = users.filter(el =>
                (el.nickname.slice(0, idx).toLowerCase()) === lowerValue
            )
            setCurrentSearch(currentUsers)
        } else {
            setCurrentSearch(usersOnline)
        }
    }

    return (
        <Fragment>
            <div className="container-usersConnected card-columns">
                {
                    currentSearch.map((user, i) => (
                        <Card
                            key={i}
                            onClick={() => props.openNewTab(user)}
                            type="button"
                            className="bg-transparent chat-gral-card-user"
                        >
                            <Card.Body className="p-0 chat-gral-bodyTable">
                                <Image
                                    className="chat-gral-icon img-responsive"
                                    src={user.socketId
                                        ? onlineIcon
                                        : offlineIcon}
                                />
                                <Card.Text className="chat-verticalText-gral mb-1">
                                    {user.nickname}
                                </Card.Text>
                                <Image
                                    className="chat-gral-profile-img"
                                    roundedCircle={true}
                                    fluid={true}
                                    src={user.profilePictureLocation}
                                />
                            </Card.Body>
                        </Card>
                    ))}
            </div>
            <div className="usersConnected-input-container">
                <Form.Control
                    type="text"
                    className="usersConnected-input"
                    placeholder="Buscar por nickname"
                    onChange={e => handleChange(e)}
                />
            </div>
        </Fragment>
    )
}
