import React, { Component } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import ButtonDinamic from '../ButtonDinamic'
import { arrayBufferToBase64 } from '../../Helpers/blobsAnd64'
import { getRanksList } from '../../Helpers/DataConvertions'

export default class SignupForms extends Component {
    constructor(props) {
        super(props)

        this.handleError = this.handleError.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.changeModal = this.changeModal.bind(this)
        this.onSubmitSignup = this.onSubmitSignup.bind(this)


        this.state = {
            nickname: '',
            name: '',
            lastName: '',
            mail: '',
            password: '',
            confirmPassword: '',
            birthDate: '',
            initialDate: '',
            dojo: '',
            instructor: '',
            isInstructor: undefined,
            rank: '',
            submitError: '',
            submitEmail: false,
            emailValidationCode: '',
            instructors: [],
            dojos: [],
            ranks: []
        }
    }

    buttonSignupRef = React.createRef()
    buttonValidationRef = React.createRef()

    async UNSAFE_componentWillMount() {
        const { data } = await axios.get('api/instructor/getlistinstructors')
        this.setState({
            instructors: data
        })
        const response = await axios.get('api/dojos/getdojos')
        this.setState({
            dojos: response.data
        })
        this.setState({
            ranks: getRanksList()
        })
    }

    handleError(err) {
        this.setState({
            submitError: err.response.data.message
        })
        this.buttonValidationRef.current.reset()
    }

    changeModal() {
        this.setState({
            submitEmail: true
        })
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    async onSubmitSignup(event) {
        event.preventDefault()
        this.setState({
            submitError: ''
        })
        const { nickname, name, lastName, mail, password, passwordCheck } = this.state
        if (password.length > 5) {
            if (password === passwordCheck) {
                this.buttonSignupRef.current.loading()
                try {
                    await axios.post('api/users/nicknameexist',
                        {
                            nickname
                        })
                    try {
                        await axios.post('api/email/emailexist',
                            {
                                name,
                                lastName,
                                mail
                            })
                        this.buttonSignupRef.current.success()
                        setTimeout(() => {
                            this.changeModal()
                        }, 1000)
                        this.setState({
                            submitError: ''
                        })
                    } catch (err) {
                        this.setState({
                            submitError: err.response.data.message
                        })
                        this.buttonSignupRef.current.reset()
                    }
                } catch (err) {
                    this.setState({
                        submitError: err.response.data.message
                    })
                    this.buttonSignupRef.current.reset()
                }
            } else {
                this.setState({
                    submitError: 'Las claves no coinciden'
                })
                this.buttonSignupRef.current.reset()
            }
        } else {
            this.setState({
                submitError: 'La clave debe tener al menos 6 caracteres'
            })
            this.buttonSignupRef.current.reset()
        }
    }

    async signupSubmit(event) {
        event.preventDefault()
        const validationCode = this.state.emailValidationCode
        this.setState({
            submitError: ''
        })
        this.buttonValidationRef.current.loading()
        try {
            const { data } = await axios.post('api/email/confirmemail',
                {
                    validationCode
                })
            const { validated } = data
            if (validated) {
                const {
                    nickname,
                    name,
                    lastName,
                    mail,
                    password,
                    passwordCheck,
                    birthDate,
                    initialDate,
                    dojo,
                    instructor,
                    isInstructor,
                    rank
                } = this.state
                try {
                    const { data } = await axios.post('api/users/signup',
                        {
                            nickname,
                            name,
                            lastName,
                            mail,
                            password,
                            passwordCheck,
                            birthDate,
                            initialDate,
                            dojo,
                            instructor,
                            isInstructor,
                            rank
                        },
                        { withCredentials: true }
                    )
                    window.localStorage.setItem('user', JSON.stringify(data))
                    try {
                        const response = await axios.get('api/pictures/getImage', { withCredentials: true })
                        arrayBufferToBase64(response.data.data.Body.data)
                        this.buttonValidationRef.current.success()
                        this.props.victoryClose()
                        this.props.main()
                    } catch (err) {
                        this.handleError(err)
                    }
                } catch (err) {
                    this.handleError(err)
                }
            }
        } catch (err) {
            this.handleError(err)
        }
    }

    render() {

        const formActual = this.state.submitEmail
            ? <Form
                onSubmit={event => this.signupSubmit(event)}
            >
                <Form.Text
                    className="text-danger text-center"
                >
                    <h3 >
                        {this.state.submitError}
                    </h3>
                </Form.Text>
                <Form.Text
                    className="text-center"
                >
                    <h4>
                        Te enviamos un correo a tu cuenta con un codigo de validación
                        </h4>
                </Form.Text>
                <Form.Text
                    className="mt-4 mb-2 text-center"
                >
                    <h6>
                        Por favor ingresa el código que te enviamos debajo y has click en validar para confirmar tu cuenta
                        </h6>
                </Form.Text>
                <Form.Control
                    required
                    id="validationcode_signup_form"
                    className="mt-3"
                    type="text"
                    name="emailValidationCode"
                    onChange={this.handleChange}
                />
                <ButtonDinamic
                    customStyle=" mt-3 "
                    successText="Gracias por unirte a nuestra comunidad"
                    buttonText="Validar"
                    type="submit"
                    size="btn-lg"
                    spinnerSize="lg"
                    ref={this.buttonValidationRef}
                />
            </Form>
            : <Form
                onSubmit={event => this.onSubmitSignup(event)}
            >
                <Form.Text
                    className="text-danger text-center"
                >
                    <h6>
                        {this.state.submitError}
                    </h6>
                </Form.Text>
                <Form.Group>
                    <Form.Control
                        maxLength={14}
                        id="signup_form_field"
                        required
                        type="text"
                        name="nickname"
                        placeholder="Nombre de Usuario"
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Row>
                        <Col>
                            <Form.Control
                                required
                                type="text"
                                name="name"
                                placeholder="Nombre"
                                onChange={this.handleChange}
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                required
                                type="text"
                                name="lastName"
                                placeholder="Apellido"
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Form.Group>
                    <Form.Control
                        required
                        type="email"
                        name="mail"
                        placeholder="Correo Electronico"
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Row>
                        <Col>
                            <Form.Control
                                required
                                type="password"
                                name="password"
                                placeholder="Ingrese su Clave"
                                onChange={this.handleChange}
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                required
                                type="password"
                                name="passwordCheck"
                                placeholder="Re Ingrese su Clave"
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Form.Group>
                    <Form.Row>
                        <Col>
                            <Form.Label
                                className="my-2 text-secondary "
                            >
                                Fecha de Nacimiento
                                </Form.Label>
                        </Col>
                        <Col>
                            <Form.Control
                                required
                                type="date"
                                name="birthDate"
                                onChange={this.handleChange}
                            />
                        </Col>
                        <Col>
                            <Form.Label
                                className="text-secondary"
                            >
                                Fecha de Inicio de Practica (Aprox)
                                 </Form.Label>
                        </Col>
                        <Col>
                            <Form.Control
                                required
                                type="date"
                                name="initialDate"
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Form.Group>
                    <Form.Row>
                        <Col>
                            <Form.Label
                                className="text-secondary"
                            >
                                ¿En que Dojo Practica?
                                 </Form.Label>
                            <Form.Control
                                required
                                name="dojo"
                                as="select"
                                onChange={this.handleChange}
                            >
                                <option></option>
                                {this.state.dojos.map((dojo, key) => (
                                    <option
                                        key={key}
                                    >
                                        {dojo.dojoName}
                                    </option>
                                ))}
                                <option>
                                    No aparece en la lista
                                    </option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Form.Label
                                className="text-secondary"
                            >
                                ¿Quien es su Instructor?
                                 </Form.Label>
                            <Form.Control
                                required
                                name="instructor"
                                as="select"
                                onChange={this.handleChange}
                            >
                                <option></option>
                                {this.state.instructors.map((inst, key) => (
                                    <option
                                        key={key}
                                    >
                                        {inst.listName}
                                    </option>
                                ))}
                                <option>
                                    No aparece en la lista
                                    </option>
                            </Form.Control>
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Form.Group>
                    <Form.Row>
                        <Col>
                            <Form.Label
                                className="text-secondary"
                            >
                                ¿Es Usted Instructor?
                                 </Form.Label>
                            <div
                                onChange={this.handleChange}
                            >
                                {['radio'].map((type) => (
                                    <div
                                        key={`custom-inline-${type}`}
                                        className="mb-3"
                                    >
                                        <Form.Check
                                            required
                                            name="isInstructor"
                                            value={true}
                                            custom
                                            inline
                                            label="Si"
                                            type={type}
                                            id={`custom-inline-${type}-1`}
                                        />
                                        <Form.Check
                                            required
                                            name="isInstructor"
                                            value={false}
                                            custom
                                            inline
                                            label="No"
                                            type={type}
                                            id={`custom-inline-${type}-2`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Col>
                        <Col>
                            <Form.Label
                                className="text-secondary"
                            >
                                ¿Cual es su Graduación?
                                 </Form.Label>
                            <Form.Control
                                required
                                name="rank"
                                as="select"
                                onChange={this.handleChange}
                            >
                                <option></option>
                                {this.state.ranks.map((rank, key) => (
                                    <option
                                        key={key}
                                    >
                                        {rank.rank}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Form.Row>
                </Form.Group>
                <ButtonDinamic
                    successText="Un paso mas..."
                    buttonText="Registrarse"
                    type="submit"
                    size="btn-lg"
                    spinnerSize="lg"
                    customStyle=" mt-3 "
                    ref={this.buttonSignupRef}
                />
            </Form>

        return (
            <div>
                {formActual}
            </div>
        )
    }
}
