import React, { useEffect, useState, useContext, Fragment } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faUndoAlt } from '@fortawesome/free-solid-svg-icons'
import { GralContext, socket } from '../../App'
import './comments.css'

export default function Comments(props) {
    const context = useContext(GralContext)
    const [comments, setComments] = useState([])
    const [publicationId, setPublicationId] = useState('')
    const [timming, setTimming] = useState([])

    useEffect(() => {
        if (props.comments) {
            setComments(props.comments)
        }
    }, [props.comments])

    useEffect(() => {
        if (props.publicationId) {
            setPublicationId(props.publicationId)
        }
    }, [props.publicationId])

    const startDeleting = (id) => {
        const elementId = id
        const deleteDivId = document.getElementById(elementId)
        const trashId = document.getElementById("trash" + elementId)
        const undoId = document.getElementById("undo" + elementId)
        deleteDivId.style.transition = ''
        deleteDivId.addEventListener('transitionend', function() {
            undoId.style.opacity = '0'
            undoId.style.zIndex = '0'
            trashId.style.opacity = '1'
            deleteDivId.style.transition = 'none'
            deleteDivId.style.opacity = '0'
            deleteDivId.style.zIndex = '0'
        })
        deleteDivId.style.opacity = '1'
        deleteDivId.style.zIndex = '2'
        trashId.style.opacity = '0'
        undoId.style.opacity = '1'
        undoId.style.zIndex = '2'
        timming.push({
           id: elementId, 
           timer:  setTimeout(async () => {
            const config = {
                params: {
                    publicationId: publicationId,
                    commentId: elementId
                },
                withCredentials: true
            }
            try {
                await axios.delete('api/blog/delcomment', config)
                socket.emit('newComment', publicationId)
                setTimming(prevState => {
                    const newArray = prevState.filter(el => el.id !== elementId)
                    return [...newArray]
                })
            } catch (err) {
                console.log(err.response)
        }
        }, 5000)
    })
}

    const cancelDeleting = (id) => {
        const ind = timming.findIndex(el => el.id === id)
        clearTimeout(timming[ind].timer)
        timming.splice(ind, 1)
        refreshStyles(id)
    }

    const refreshStyles = (id) => {
        const deleteDivId = document.getElementById(id)
        deleteDivId.style.transition = 'none'
        deleteDivId.style.opacity = '0'
        deleteDivId.style.zIndex = '0'
        document.getElementById("undo" + id).style.opacity = '0'
        document.getElementById("undo" + id).style.zIndex = '0'
        document.getElementById("trash" + id).style.opacity = '1'
    }

    return (
        <Fragment>
            {comments.length > 0
                ? comments.map((comment, key) => (
                    <Card.Footer
                        key={key}
                        className="publishCard-comment"
                    >
                        <div
                            id={comment._id}
                            className="comment-delete-div"
                        >
                        </div>
                        <div
                            className="publishCard-comment-img-div"
                        >
                            <Image
                                className="publishCard-comment-img"
                                roundedCircle={true}
                                fluid={true}
                                src={comment.commentAuthor.profilePictureLocation}
                            />
                        </div>
                        <div 
                        className="publishCard-comment-trash"
                        >
                            {comment.commentAuthor._id === context.state.user._id
                              ? <Fragment>  
                               <FontAwesomeIcon
                               className="publishCard-comment-trashIcon"
                                        type="button"
                                        id={"trash" + comment._id}
                                        onClick={() => startDeleting(comment._id)}
                                        icon={faTrashAlt}
                                        size='lg'
                                        color='#817878'
                                    />
                               <FontAwesomeIcon
                                    className="comment-delete-icon"
                                    type="button"
                                    id={"undo" + comment._id}
                                    onClick={() => cancelDeleting(comment._id)}
                                    icon={faUndoAlt}
                                />
                                </Fragment>
                           :null }
                        </div>
                        <div 
                        className="publishCard-comment-div"
                        >
                            <span>
                                <p 
                                className="publishCard-comment-nickname"
                                >
                                    {comment.commentAuthor.nickname}:
                                    </p>
                                    </span>
                            <span>
                                <p
                                 className="publishCard-comment-comment"
                                 >
                                     {comment.message}
                                 </p>
                                 </span>
                        </div>
                    </Card.Footer>
                ))
                : null}
        </Fragment>
    )
}
