import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import ButtonDinamic from '../ButtonDinamic'

export default class PasswordUpd extends Component {
    constructor(props) {
        super(props)

        this.updatePassword = this.updatePassword.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            password: '',
            newPassword: '',
            newPasswordCheck: '',
            submitModalError: ''
        }
    }

    buttonRef = React.createRef()

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    async updatePassword(event) {
        event.preventDefault()
        this.setState({
            submitModalError: ''
        })
        const { password, newPassword, newPasswordCheck } = this.state
        if (newPassword.length > 5) {
            if (newPassword === newPasswordCheck) {
                this.buttonRef.current.loading()
                try {
                    const response = await axios.post('api/users/updatepassword', { password, newPassword }, { withCredentials: true })
                    if (response) {
                        this.buttonRef.current.success()
                        this.props.victoryClose()
                    }
                } catch (err) {
                    this.buttonRef.current.reset()
                    this.setState({
                        submitModalError: err.response.data.message
                    })
                }
            } else {
                this.setState({
                    submitModalError: 'La claves nuevas no coinciden'
                })
            }
        } else {
            this.setState({
                submitModalError: 'La clave debe tener al menos 6 caracteres'
            })
        }
    }

    render() {
        return (
            <Form
                className="mt-1"
                name="profilePicture"
                onSubmit={event => this.updatePassword(event)}
            >
                <Form.Control
                    required
                    className="mb-3"
                    onChange={this.handleChange}
                    name="password"
                    type="password"
                    placeholder="Ingrese su contraseña actual"
                />
                <Form.Control
                    required
                    className="mb-3"
                    onChange={this.handleChange}
                    name="newPassword"
                    type="password"
                    placeholder="Ingrese su nueva contraseña"
                />
                <Form.Control
                    required
                    onChange={this.handleChange}
                    name="newPasswordCheck"
                    type="password"
                    placeholder="Reingrese su nueva contraseña"
                />
                <Form.Text className="text-danger h6 text-left">
                    {this.state.submitModalError}
                </Form.Text>
                <ButtonDinamic
                    customStyle=" mt-2 "
                    successText="Clave actualizada con exito"
                    buttonText="Actualizar contraseña"
                    type="submit"
                    size="btn-md"
                    spinnerSize="md"
                    ref={this.buttonRef}
                />
            </Form>
        )
    }
}
