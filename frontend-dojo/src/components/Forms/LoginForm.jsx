import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import { arrayBufferToBase64 } from '../../Helpers/blobsAnd64'
import ButtonDinamic from '../ButtonDinamic'
import ModalForm from '../ModalForm'
import SignupForms from '../Forms/SignupForms'
export default class LoginForm extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleSignup = this.handleSignup.bind(this)

        this.state = {
            submitError: '',
            mail: '',
            password: ''
        }
    }

    buttonRef = React.createRef()
    modalSignupProcessRef = React.createRef()

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSignup() {
        this.modalSignupProcessRef.current.show()
        setImmediate(() => {
            ReactDOM.findDOMNode(document.getElementById('signup_form_field')).focus()
        }, 50)
    }

    async onSubmitLogin(event) {
        event.preventDefault()
        this.setState({
            submitError: ''
        })
        this.buttonRef.current.loading()
        const { mail, password } = this.state
        try {
            const { data } = await axios.post('api/users/login',
                {
                    mail,
                    password
                },
                { withCredentials: true }
            )
            window.localStorage.setItem('user', JSON.stringify(data))
            try {
                const response = await axios.get('api/pictures/getImage', { withCredentials: true })
                arrayBufferToBase64(response.data.data.Body.data)
                this.buttonRef.current.success()
                this.props.victoryClose()
                this.props.main()
                // window.location.reload(true)
            } catch (err) {
                this.setState({
                    submitError: 'No pudimos encontrar su foto de perfil'
                })
            }
        } catch (err) {
            this.buttonRef.current.reset()
            console.log(err.response)
            this.setState({
                submitError: err.response.data.message
            })
        }
    }

    render() {
        return (
            <Fragment>
                <Form
                    id="loginForm"
                    className="bg-transparent"
                    onSubmit={event => this.onSubmitLogin(event)}
                >
                    <Form.Group>
                        <Form.Text
                            className="text-danger text-center"
                        >
                            <h6 >
                                {this.state.submitError}
                            </h6>
                        </Form.Text>
                        <Form.Control
                            id="login_form_field"
                            required
                            type="email"
                            name="mail"
                            placeholder="Ingrese su Correo Electronico"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            required
                            type="password"
                            name="password"
                            placeholder="Ingrese su Clave"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Text
                        onClick={this.handleSignup}
                        type="button"
                        className="ml-2 text-primary"
                    >
                        ¿No tenes un usuario? Registrate aca
                         </Form.Text>
                    {/* Button Component */}
                    <ButtonDinamic
                        successText="Bienvenido de nuevo"
                        buttonText="Ingresar"
                        type="submit"
                        size="btn-lg"
                        spinnerSize="lg"
                        customStyle=" mt-3 "
                        ref={this.buttonRef} />
                </Form>
                <ModalForm
                    onExit={() => this.props.close()}
                    backdrop='static'
                    ref={this.modalSignupProcessRef}
                    title="Bienvenid@! Registrate para acceder a todo el contenido"
                    size="lg"
                >
                    {<SignupForms />}
                </ModalForm>
            </Fragment>
        )
    }
}
