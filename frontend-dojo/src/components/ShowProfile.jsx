import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Image from 'react-bootstrap/Image'
import { Emoji } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

import './showProfile.css'

export default function ShowProfile(props) {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getUser(user) {
            try {
                const { data } = await axios.get(`api/users/getuserbynickname/${user}`, { withCredentials: true })
                setUser(data)
                setLoading(false)
            } catch (err) {
                console.log(err.response)
            }
        }
        if (props.user) {
            getUser(props.user)
        }
    }, [props.user])

    const shrugEmoji = (fieldName) => {
        const genderValue = Math.floor(Math.random() * 100)
        const skynValue = Math.floor(Math.random() * 6) + 1
        const emojiId = genderValue > 50
            ? "man-shrugging"
            : "woman-shrugging"
        return <span>{fieldName}<Emoji emoji={{ id: emojiId, skin: skynValue }} size={50} /></span>
    }

    return (
        <Card className="showProfile-card bg-transparent">
            {!loading
                ? <Card.Body className="showProfile-body">
                    <Image
                        className="showProfile-img card-img"
                        roundedCircle={true}
                        src={user.profilePictureLocation}
                    />

                    <div className="showProfile-nickname-container ">
                        <Card.Title className="showProfile-nickname">
                            {user.nickname}
                        </Card.Title>
                    </div>
                    <Card.Subtitle className="showProfile-dojo text-secondary">
                        {user.dojo === 'No aparece en la lista'
                            ? shrugEmoji('Dojo: ')
                            : user.dojo
                        }
                    </Card.Subtitle>
                    <div className="showProfile-bar" />
                    <div className="showProfile-data">
                        <Card.Text className="showProfile-name">
                            {"Nombre: "}
                        </Card.Text>
                        <Card.Text className="showProfile-name-content">
                            {user.name + " " + user.lastName}
                        </Card.Text>
                        <Card.Text className="showProfile-rank">
                            {"Graduación: "}
                        </Card.Text>
                        <Card.Text className="showProfile-rank-content">
                            {user.rank}
                        </Card.Text>
                        <Card.Text className="showProfile-instructor">
                            {"Instructor: "}
                        </Card.Text>
                        <Card.Text className="showProfile-instructor-content">
                            {user.instructor === 'No aparece en la lista'
                                ? "- "
                                : user.instructor
                            }
                        </Card.Text>
                        {user.mail
                            ? <Fragment>
                                <Card.Text className="showProfile-mail">
                                    {"Correo: "}
                                </Card.Text>
                                <Card.Text className="showProfile-mail-content">
                                    {user.mail}
                                </Card.Text>
                                <Card.Text className="showProfile-cellphone">
                                    {"Celular: "}
                                </Card.Text>
                                <Card.Text className="showProfile-cellphone-content">
                                    {user.cellphone}
                                </Card.Text>
                                <Card.Text className="showProfile-age">
                                    {"Edad: "}
                                </Card.Text>
                                <Card.Text className="showProfile-age-content">
                                    {user.age + " años"}
                                </Card.Text>
                                <Card.Text className="showProfile-birthDate">
                                    {"Fecha de nacimiento: "}
                                </Card.Text>
                                <Card.Text className="showProfile-birthDate-content">
                                    {user.birthDate}
                                </Card.Text>
                                <Card.Text className="showProfile-initialDate">
                                    {"Inicio de practica: "}
                                </Card.Text>
                                <Card.Text className="showProfile-initialDate-content">
                                    {user.initialDate}
                                </Card.Text>
                            </Fragment>
                            : null
                        }
                    </div>
                    <Card.Text className="showProfile-aboutMe">
                        {user.aboutMe === 'Escribe algo sobre tí (500 caracteres max)'
                            ? 'El usuario todavia no agrego información.'
                            : user.aboutMe
                        }
                    </Card.Text>
                </Card.Body>
                : <Card.Body className="showProfile-body">
                    <Spinner
                        className="showProfile-spinner"
                        animation="border"
                        role="status"
                    />
                    <p className="showProfile-spinner-text">
                        Cargando...
                        </p>
                </Card.Body>
            }
        </Card>
    )
}
