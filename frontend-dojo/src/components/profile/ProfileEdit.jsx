import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ButtonDinamic from '../ButtonDinamic'
import ModalAlert from '../ModalAlert'
import { socket } from '../../App'
import { getRanksList } from '../../Helpers/DataConvertions'

import './profile.css'
import './profileEdit.css'

export default class ProfileEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            nickname: '',
            name: '',
            lastName: '',
            mail: '',
            birthDate: '',
            initialDate: '',
            dojo: '',
            instructor: '',
            rank: '',
            aboutMe: '',
            cellphone: 'Ingresa tu celular',
            editForm: false,
            submitError: '',
            profilePicture: null,
            editStyle: "profile_edit",
            maxChar: '',
            instructors: [],
            dojos: [],
            ranks: [],
            displayError: '',
            emailValidationCode: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.cancel = this.cancel.bind(this)
        this.saveProcess = this.saveProcess.bind(this)
        this.confirmValidationProcess = this.confirmValidationProcess.bind(this)
        this.checkForEmailValidation = this.checkForEmailValidation.bind(this)
        this.checkValidationCode = this.checkValidationCode.bind(this)
        this.checkForCellphoneValid = this.checkForCellphoneValid.bind(this)
        this.updateEditionForm = this.updateEditionForm.bind(this)
    }

    buttonRefSubmit = React.createRef()
    buttonRefCancel = React.createRef()
    buttonValidationRef = React.createRef()
    modalButtonRefSubmit = React.createRef()
    modalButtonRefCancel = React.createRef()
    modalValidationWarningRef = React.createRef()
    modalEmailValidationProcessRef = React.createRef()

    componentDidMount() {
        this.updateEditionForm()
        this.setState({
            ranks: getRanksList()
        })
    }

    async updateEditionForm() {
        this.setState(this.props.state)
        const { data } = await axios.get('api/instructor/getlistinstructors')
        this.setState({
            instructors: data
        })
        const response = await axios.get('api/dojos/getdojos')
        this.setState({
            dojos: response.data
        })

    }

    cancel(event) {
        if (event) {
            event.preventDefault()
        }
        this.buttonRefSubmit.current.reset()
        this.buttonRefCancel.current.reset()
        this.props.closeEdit()
        this.updateEditionForm()
    }

    checkForCellphoneValid(event) {
        event.preventDefault()
        this.buttonRefSubmit.current.loading()
        this.buttonRefCancel.current.disabled()
        if (this.state.cellphone) {
            const newNumber = this.state.cellphone.trim()
            const checkPhone = new RegExp(/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/g)
            if (checkPhone.test(newNumber)) {
                this.confirmValidationProcess()
            } else {
                this.buttonRefSubmit.current.reset()
                this.buttonRefCancel.current.reset()
                setTimeout(() => {
                    this.setState({
                        submitError: ''
                    })
                }, 5000)
                this.setState({
                    submitError: "El celular ingresado no es valido"
                })
            }
        } else {
            this.confirmValidationProcess()
        }
    }

    async confirmValidationProcess() {

        if (this.state.nickname !== this.props.state.nickname) {
            try {
                await axios.post('api/users/nicknameexist',
                    {
                        nickname: this.state.nickname
                    })
                if (this.state.instructor !== this.props.state.instructor || this.state.dojo !== this.props.state.dojo || this.state.rank !== this.props.state.rank) {
                    this.modalValidationWarningRef.current.show()
                } else {
                    if (this.state.mail !== this.props.state.mail) {
                        this.checkForEmailValidation()
                    } else {
                        this.saveProcess()
                    }
                }
            } catch (err) {
                // NICKNAME EXIST ERROR
                setTimeout(() => {
                    this.setState({
                        submitError: ''
                    })
                }, 5000)
                this.setState({
                    submitError: err.response.data.message
                })
                this.buttonRefSubmit.current.reset()
                this.buttonRefCancel.current.disabled()
            }
        } else {
            if (this.state.instructor !== this.props.state.instructor || this.state.dojo !== this.props.state.dojo || this.state.rank !== this.props.state.rank) {
                this.modalValidationWarningRef.current.show()
            } else {
                if (this.state.mail !== this.props.state.mail) {
                    this.checkForEmailValidation()
                } else {
                    this.saveProcess()
                }
            }
        }
    }

    async checkForEmailValidation() {
        if (this.state.mail !== this.props.state.mail) {
            try {
                await axios.post('api/email/emailexist',
                    {
                        name: this.state.name,
                        lastName: this.state.lastName,
                        mail: this.state.mail
                    })
                this.modalValidationWarningRef.current.close()
                this.modalEmailValidationProcessRef.current.show()
            } catch (err) {
                console.log(err.response)
                // EMAIL EXIST ERROR
                setTimeout(() => {
                    this.setState({
                        submitError: ''
                    })
                }, 5000)
                this.setState({
                    submitError: err.response.data.message
                })
                this.buttonRefSubmit.current.reset()
                this.buttonRefCancel.current.reset()
                this.modalValidationWarningRef.current.close()
            }
        } else {
            this.saveProcess()
        }
    }

    async checkValidationCode(event) {
        event.preventDefault()
        this.buttonValidationRef.current.loading()
        try {
            await axios.post('api/email/confirmemail',
                {
                    validationCode: this.state.emailValidationCode
                })
            this.buttonValidationRef.current.success()
            this.modalEmailValidationProcessRef.current.close()
            this.saveProcess()
        } catch (err) {
            this.buttonValidationRef.current.reset()
            this.buttonRefSubmit.current.reset()
            this.buttonRefCancel.current.reset()
            setTimeout(() => {
                this.setState({
                    submitError: ''
                }, 5000)
            })
            this.setState({
                submitError: err.response.data.message
            })
        }
    }


    async saveProcess() {
        this.modalValidationWarningRef.current.close()
        let dataValidation,
            needValidation
        if (this.state.instructor !== this.props.state.instructor || this.state.dojo !== this.props.state.dojo || this.state.rank !== this.props.state.rank) {
            dataValidation = false
            needValidation = true
        } else {
            dataValidation = null
        }
        try {
            const {
                nickname,
                name,
                lastName,
                mail,
                birthDate,
                initialDate,
                dojo,
                instructor,
                rank,
                aboutMe,
                cellphone
            } = this.state
            const { data } = await axios.put('api/users/updateuser',
                {
                    needValidation,
                    dataValidation,
                    nickname,
                    name,
                    lastName,
                    mail,
                    birthDate,
                    initialDate,
                    dojo,
                    instructor,
                    rank,
                    aboutMe,
                    cellphone
                },
                { withCredentials: true }
            )
            window.localStorage.setItem('user', JSON.stringify(data))
            const user = data
            socket.emit('userUpdate', { user })
            this.buttonRefSubmit.current.success()
            this.buttonRefCancel.current.reset()
            setTimeout(() => {
                this.cancel()
            }, 2500)
        } catch (err) {
            this.buttonRefSubmit.current.reset()
            this.buttonRefCancel.current.reset()
            this.setState({
                submitError: err.response.data.message
            })
        }
    }

    handleChange(event) {

        const { name, value } = event.target
        if (name !== undefined) {
            this.setState({
                [name]: value,
            })
        }
        if (name === "aboutMe") {
            setTimeout(() => {
                let count = 500 - this.state.aboutMe.length
                this.setState({
                    maxChar: count + " caracteres restantes."
                })
            }, 50)
        }
    }


    render() {
        // SHOW CHARACTER AVAILABLE
        const maxCharWarning = this.state.maxChar === "0 caracteres restantes."
            ? "text-danger"
            : "text-primary"

        return (
            <Fragment>
                <Form className="profileEdit-mask">
                    {/* NICKNAME */}
                    <Form.Control
                        maxLength={14}
                        id="profileNickname"
                        className="nickname-profile-edit text-center"
                        type="text"
                        name="nickname"
                        placeholder={this.props.state.nickname}
                        onChange={this.handleChange}
                    />
                    {/* NAME */}
                    <Form.Control
                        maxLength={12}
                        id="profileGral"
                        className="name-profile-edit text-center"
                        type="text" name="name"
                        placeholder={this.props.state.name}
                        onChange={this.handleChange}
                    />
                    {/* LASTNAME */}
                    <Form.Control
                        maxLength={12}
                        id="profileGral"
                        className="lastName-profile-edit text-center"
                        type="text" name="lastName"
                        placeholder={this.props.state.lastName}
                        onChange={this.handleChange}
                    />
                    {/* MAIL */}
                    <Form.Control
                        className="mail-profile-edit text-center"
                        type="text" id="profileMail"
                        name="mail"
                        placeholder={this.props.state.mail}
                        onChange={this.handleChange} />
                    {/* BIRTHDAY */}
                    <div type="button">
                        <Form.Control
                            className="birthday-profile-edit text-center"
                            type="date"
                            name="birthDate"
                            placeholder={this.props.state.birthDate}
                            onChange={this.handleChange}
                        />
                    </div>
                    {/* INITIALDATE */}
                    <Form.Control
                        className="initialDate-profile-edit text-center"
                        type="date"
                        name="initialDate" placeholder={this.props.state.initialDate}
                        onChange={this.handleChange}
                    />
                    {/* INSTRUCTOR */}
                    <Form.Control
                        className="instructor-profile-edit"
                        name="instructor"
                        as="select"
                        onChange={this.handleChange}
                    >
                        <option>{this.state.instructor}</option>
                        {this.state.instructors.map((inst, key) => (
                            <option key={key}>{inst.listName}</option>
                        ))}
                        <option>No aparece en la lista</option>
                    </Form.Control>
                    {/* DOJO */}
                    <Form.Control
                        className="dojo-profile-edit"
                        name="dojo" as="select"
                        onChange={this.handleChange}>
                        <option>{this.state.dojo}</option>
                        {this.state.dojos.map((dojo, key) => (
                            <option key={key}>{dojo.dojoName}</option>
                        ))}
                        <option>No aparece en la lista</option>
                    </Form.Control>
                    {/* RANK */}
                    <Form.Control
                        className="rank-profile-edit"
                        name="rank"
                        as="select"
                        onChange={this.handleChange}
                    >
                        <option>{this.state.rank}</option>
                        {this.state.ranks.map((rank, key) => (
                            <option key={key}>
                                {rank.rank}
                            </option>
                        ))}
                    </Form.Control>
                    {/* ABOUTME */}
                    <p className={"maxChar-profile-edit " + maxCharWarning}>
                        {this.state.maxChar}
                    </p>
                    <Form.Control
                        className="aboutMe-profile-edit text-justify"
                        maxLength="500"
                        as="textarea" name="aboutMe"
                        placeholder={this.props.state.aboutMe}
                        onChange={this.handleChange}
                    />
                    {/* CELLPHONE */}
                    <Form.Control
                        className="cellphone-profile-edit text-center"
                        maxLength="500"
                        type="text"
                        name="cellphone"
                        placeholder={this.props.state.cellphone}
                        onChange={this.handleChange}
                    />
                    <p className="warning-profile-edit text-danger text-center">
                        {this.state.submitError}
                    </p>
                    <ButtonDinamic
                        customStyle="buttonCancel-profile-edit"
                        color="btn-dark"
                        buttonText="Cancelar"
                        type="submit"
                        size="btn-lg"
                        spinnerSize="lg"
                        onClick={(event) => this.cancel(event)}
                        ref={this.buttonRefCancel}
                    />
                    <ButtonDinamic
                        customStyle="buttonUpdate-profile-edit"
                        successText="Actualizado"
                        buttonText="Actualizar"
                        type="submit"
                        size="btn-lg"
                        spinnerSize="lg"
                        onClick={(event) => this.checkForCellphoneValid(event)}
                        ref={this.buttonRefSubmit}
                    />
                </Form>
                {/* MODALALERT VALIDATION PROCESS */}
                < ModalAlert
                    dialogClassName="profileEdit-modalDialog"
                    backdrop={true}
                    size="lg"
                    title="¿Estas seguro que queres actualizar estos datos?"
                    ref={this.modalValidationWarningRef}
                >
                    <Card.Text className="text-center text-danger h5">
                        {this.state.displayError}
                    </Card.Text>
                    <Row>
                        <Card.Text className="text-center h5">
                            Modificar el campo de instructor, dojo o graduación hará que tu cuenta quede pendiente de validación y no podras usar las caracteristicas de la página hasta que se valide.
                            </Card.Text>
                        <Col>
                            <ButtonDinamic
                                color="btn-secondary"
                                buttonText="Mejor no"
                                type="submit"
                                size="btn-md"
                                spinnerSize="md"
                                onClick={() => this.modalValidationWarningRef.current.close()}
                                ref={this.modalButtonRefCancel}
                            />
                        </Col>
                        <Col>
                            <ButtonDinamic
                                successText="Datos Actualizados"
                                buttonText="Estoy seguro"
                                type="submit"
                                size="btn-md"
                                spinnerSize="md"
                                color="btn-danger"
                                onClick={() => this.checkForEmailValidation()}
                                ref={this.modalButtonRefSubmit}
                            />
                        </Col>
                    </Row>
                </ModalAlert >
                {/* MODAL EMAIL VALIDATION */}
                <ModalAlert
                    backdrop='static'
                    ref={this.modalEmailValidationProcessRef}
                    title="Validemos tu nuevo correo"
                    size="lg"
                >
                    {<Form onSubmit={event => this.checkValidationCode(event)}>
                        <Form.Text className="text-danger text-center" >
                            <h3 >
                                {this.state.submitError}
                            </h3>
                        </Form.Text>
                        <Form.Text className="text-center" >
                            <h4>
                                Te enviamos un correo a tu cuenta con un codigo de validación
                            </h4>
                        </Form.Text>
                        <Form.Text className="mt-4 mb-2 text-center" >
                            <h6>
                                Por favor ingresa el codigo que te enviamos debajo y has click en validar para confirmar.
                            </h6>
                        </Form.Text>
                        <Form.Control
                            id="validationcode_signup_form"
                            className="mt-3"
                            type="text"
                            name="emailValidationCode"
                            onChange={this.handleChange}
                        />
                        <ButtonDinamic
                            customStyle=" mt-3 "
                            successText="Usuario actualizado"
                            buttonText="Validar y actualizar usuario"
                            type="submit"
                            size="btn-lg"
                            spinnerSize="lg"
                            ref={this.buttonValidationRef}
                        />
                    </Form>}
                </ModalAlert>
            </Fragment>
        )
    }
}
