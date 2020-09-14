import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import TextAreaTinyMCE from './TextAreaTinyMCE'
import ButtonDinamic from '../ButtonDinamic'
import BlogForm from './BlogForm'
import { socket } from '../../App'
import './publications.css'

export default class Publications extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitError: '',
            title: ''
        }

        this.createPublish = this.createPublish.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }

    textAreaRef = React.createRef()
    buttonRefSubmit = React.createRef()
    pubListRef = React.createRef()

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value,
        })
    }

    async createPublish(event) {
        event.preventDefault()
        this.buttonRefSubmit.current.loading()
        const publication = this.textAreaRef.current.sendContent(),
            title = this.state.title,
            created_at = Date.now()
        if (publication !== null) {
            try {
                await axios.post('api/blog/publish',
                    {
                        publication,
                        title,
                        created_at
                    },
                    { withCredentials: true }
                )
                socket.emit('latestPubUpdated', 'updated')
                this.buttonRefSubmit.current.success()
                this.pubListRef.current.getPublications()
                setTimeout(() => {
                    this.buttonRefSubmit.current.reset()
                }, 1500)

            } catch (err) {
                this.buttonRefSubmit.current.reset()
                this.setState({
                    submitError: err.response.data.message
                })
            }
        } else {
            setTimeout(() => {
                this.setState({
                    submitError: ''
                })
            }, 5000)
            this.buttonRefSubmit.current.reset()
            this.setState({
                submitError: 'Tenes que escribir algo antes de publicar.'
            })
        }
    }

    render() {
        return (
            <Fragment>
                <h3 className="publications-submitError">
                    {this.state.submitError}
                </h3>
                <div className="bg-publications">
                    <Row className="publications-container  container-fluid">
                        <Col>
                            <Row>
                                <Col className="publications-form text-center">
                                    <Card.Title className="publications-title mt-3">
                                        Escribe una publicación para compartir con la comunidad
                        </Card.Title>
                                    <Form onSubmit={event => this.createPublish(event)}>
                                        <Form.Control
                                            required
                                            maxLength={26}
                                            className="mt-3 mb-3 text-center"
                                            type="text" name="title"
                                            placeholder="Elige un titulo que describa tu publicacion"
                                            onChange={this.handleChange}
                                        />
                                        <TextAreaTinyMCE ref={this.textAreaRef} />
                                        <div className="publications-button-div">
                                            <ButtonDinamic
                                                customStyle="publications-button-publish"
                                                successText="Publicado"
                                                buttonText="Publicar"
                                                name="submitbtn"
                                                type="submit"
                                                size="btn-lg"
                                                spinnerSize="lg"
                                                ref={this.buttonRefSubmit}
                                            />
                                        </div>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="publications-publications container-fluid">
                            <BlogForm ref={this.pubListRef} />
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }
}
