import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import ButtonDinamic from '../ButtonDinamic'
import axios from 'axios'
import { arrayBufferToBase64 } from '../../Helpers/blobsAnd64'
import { socket } from '../../App'
export default class ProPicUpdForm extends Component {
    constructor(props) {
        super(props)

        this.handlerImage = this.handlerImage.bind(this)
        this.savePicture = this.savePicture.bind(this)

        this.state = {
            submitModalError: '',
            selectedFile: null,
            labelBrowse: 'Elige una imagen para usar como foto de perfil'
        }
    }

    buttonRef = React.createRef()

    async savePicture(event) {
        event.preventDefault()
        this.setState({
            submitModalError: ''
        })
        if (this.state.selectedFile) {
            const image = new FormData()
            image.append('image', this.state.selectedFile, this.state.selectedFile.name)
            this.buttonRef.current.loading()
            try {
                const { data } = await axios.post('api/pictures/putImage', image, {
                    withCredentials: true
                })
                window.localStorage.setItem('user', JSON.stringify(data.user))
                const { user } = data
                socket.emit('userUpdate', { user })
                if (user) {
                    try {
                        const res = await axios.get('api/pictures/getImage', { withCredentials: true })
                        arrayBufferToBase64(res.data.data.Body.data)
                        this.props.ProPicUpdated()
                        this.buttonRef.current.success()
                        this.props.victoryClose()
                    } catch (err) {
                        this.buttonRef.current.reset()
                        this.setState({
                            submitModalError: err.message
                        })
                    }
                }
            } catch (err) {
                console.log(err.response)
                this.buttonRef.current.reset()
                this.setState({
                    submitModalError: err.response.data.message
                })
            }
        } else {
            this.buttonRef.current.reset()
            this.setState({
                submitModalError: 'Debes seleccionar una imagen'
            })
        }
    }

    handlerImage(event) {
        const file = event.target.files[0]
        if (file !== undefined) {
            this.setState({
                selectedFile: file,
                labelBrowse: file.name
            })
        }
    }

    render() {
        return (
            <Form
                className="mt-1"
                name="profilePicture"
                onSubmit={(event) => this.savePicture(event)}
            >
                <Form.Group
                    controlId="customFile"
                    className="custom-file"
                >
                    <Form.File
                        onChange={this.handlerImage}
                        type="file"
                        className="custom-file-input"
                    />
                    <Form.Label
                        className="custom-file-label"
                        data-browse="Examinar"
                    >
                        {this.state.labelBrowse}
                    </Form.Label>
                </Form.Group>
                <Form.Text
                    className="text-danger h6 text-left"
                >
                    {this.state.submitModalError}
                </Form.Text>
                <ButtonDinamic
                    customStyle=" mt-2 "
                    successText="Imagen actualizada con éxito"
                    buttonText="Subir imagen"
                    type="submit"
                    size="btn-md"
                    ref={this.buttonRef}
                />
            </Form>
        )
    }
}
