import React, { useRef, useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import TimeAgo from 'timeago-react'
import { register } from 'timeago.js'
import es from 'timeago.js/lib/lang/es'
import { socket } from '../../App'
import ModalAlert from '../ModalAlert'
import ButtonDinamic from '../ButtonDinamic'
import ShowProfile from '../ShowProfile'
import Input from '../Input'
import Comments from './Comments'
import './publishCard.css'

register('es', es)

export default function PublishCard(props) {

    const modalUserRef = useRef()
    const modalDeleteWarningRef = useRef(null)
    const modalPublishViewRef = useRef(null)
    const buttonRefCancel = useRef(null)
    const buttonRefSubmit = useRef(null)

    const [pub, setPub] = useState({})
    const [comments, setComments] = useState([])
    const [displayError, setdisplayError] = useState('')

    useEffect(() => {
        if (props.pub) {
            setPub(props.pub)
            setComments(props.pub.comments)
        }
    }, [props.pub])

    useEffect(() => {
        if (pub) {
            socket.on(pub._id, async () => {
                const { data } = await axios.get(`api/blog/getcomments/${pub._id}`, { withCredentials: true })
                setComments(() => {
                    return [...data.comments]
                })
            })
        }
    }, [pub])

    const confirmDelete = async () => {
        buttonRefSubmit.current.loading()
        buttonRefCancel.current.disabled()
        try {
            await axios.delete(`api/blog/delpublication/${pub._id}`,
                { withCredentials: true })
            if (props.getPublications) {
                props.getPublications()
            }
            buttonRefSubmit.current.success()
            modalDeleteWarningRef.current.victoryClose()
            socket.emit('latestPubUpdated', 'updated')
        } catch (err) {
            buttonRefCancel.current.reset()
            buttonRefSubmit.current.reset()
            setdisplayError(err.response.data.message)
            setTimeout(() => {
                setdisplayError('')
            }, 1500)
        }
    }

    const sendComment = async (message) => {
        if (message) {
            try {
                await axios.post('api/blog/postcomment', {
                    publicationId: pub._id,
                    comment: message
                },
                    { withCredentials: true })
                socket.emit('newComment', pub._id)
            } catch (err) {
                console.log(err.response)
            }
        }
    }

    return (
        <Fragment>
            <Card
                className="publishCard-card bg-transparent"
            >
                <Card.Body
                    className="publishCard-body"
                >
                    <div
                        className="publishCard-trashIcon"
                    >
                        {props.deleteOption
                            ? <FontAwesomeIcon
                                type="button"
                                onClick={() => modalDeleteWarningRef.current.show()}
                                icon={faTrashAlt}
                                size='lg'
                                color='#817878'
                            />
                            : null}
                    </div>
                    <div>
                        {props.userPicture && pub.author
                            ? <Image
                                className="publishCard-img"
                                roundedCircle={true}
                                fluid={true}
                                src={pub.author.profilePictureLocation}
                            />
                            : null}
                    </div>

                    <Card.Title
                        className="publishCard-title text-right"
                    >
                        {pub.title}
                    </Card.Title>
                    {props.userShow && pub.author
                        ? <Card.Text
                            type="button"
                            className="publishCard-user"
                            onClick={() => modalUserRef.current.show()}
                        >
                            {pub.author.nickname}
                        </Card.Text>
                        : null}
                    <Card.Text
                        type="button"
                        className="publishCard-show p-0 text-primary text-right"
                        onClick={() => modalPublishViewRef.current.show()}
                    >
                        Ver la publicacion
                    </Card.Text>
                    <div
                        className="publishCard-card-footer"
                    >
                        <div
                            className="publishCard-card-timeAgo text-right text-secondary"
                        >
                            <TimeAgo
                                datetime={pub.created_at}
                                locale='es'
                            />
                        </div>
                    </div>
                </Card.Body>
            </Card >
            {/* Modal Publish */}
            < ModalAlert
                size="lg"
                title={pub.title}
                ref={modalPublishViewRef}
            >
                <Card >
                    <Card.Body>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: pub.body
                            }}
                        />
                    </Card.Body>
                    <Card.Footer>
                        <Row>
                            <Col
                                className="publishCard-timeAgo ml-2 col-8"
                            >
                                <TimeAgo
                                    datetime={pub.created_at}
                                    locale='es'
                                />
                            </Col>
                            <Col
                                className="text-right"
                            >
                                {props.deleteOption
                                    ? <FontAwesomeIcon
                                        type="button"
                                        onClick={() => modalDeleteWarningRef.current.show()}
                                        icon={faTrashAlt}
                                        size='lg'
                                        color='#817878'
                                    />
                                    : null}
                            </Col>
                        </Row>
                    </Card.Footer>
                    <Card.Footer
                        className="publishCard-comment-footerInput"
                    >
                        <div
                            className="publishCard-comment-input"
                        >
                    
                            <Input
                                idInput={pub._id}
                                sendTyping={null}
                                placeholderInput="Escribi un comentario..."
                                onKeyPressInput={sendComment}
                            />
                        </div>
                    </Card.Footer>
                    <Comments
                        publicationId={pub._id}
                        comments={comments.reverse()}
                    />
                </Card>
            </ModalAlert >
            {/* Modal delete publication */}
            < ModalAlert
                dialogClassName="publishCard-custom-dialog"
                backdrop={true}
                size="lg"
                title="¿Estas seguro que queres borra la publicación?"
                ref={modalDeleteWarningRef}
            >
                <Card.Text
                    className="text-center h5"
                >
                    No podras recuperarla una vez borrada
                 </Card.Text>
                <Card.Text
                    className="text-center text-danger h5"
                >
                    {displayError}
                </Card.Text>
                <Row>
                    <Col>
                        <ButtonDinamic
                            color="btn-secondary"
                            buttonText="Mejor no"
                            type="submit"
                            size="btn-md"
                            spinnerSize="md"
                            onClick={() => modalDeleteWarningRef.current.close()}
                            ref={buttonRefCancel}
                        />
                    </Col>
                    <Col>
                        <ButtonDinamic
                            successText="Publicacion eliminada"
                            buttonText="Borrar"
                            type="submit"
                            size="btn-md"
                            spinnerSize="md"
                            color="btn-danger"
                            onClick={() => confirmDelete()}
                            ref={buttonRefSubmit}
                        />
                    </Col>
                </Row>
            </ModalAlert >
            {/* MODAL USER */}
            {pub.author
                ? <ModalAlert
                    ref={modalUserRef}
                    dialogClassName="pubBoard-modalUser"
                    customStyles="pubBoard-modalUserCustom"
                    backdrop={true}
                    size="lg"
                    title={pub.author.nickname}
                >
                    <ShowProfile
                        user={pub.author.nickname}
                    />
                </ModalAlert>
                : null}
        </Fragment >
    )
}
