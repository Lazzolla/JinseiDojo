import React, { Component } from 'react'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import kanjis from '../../pictures/profile/AikidoKanjis.png'
import { socket } from '../../App'
import ModalForm from '../ModalForm'
import PropPicUpdForm from '../Forms/ProPicUpdForm'
import PasswordUpd from '../Forms/PasswordUpd'
import ProfileEdit from './ProfileEdit'
import Privacy from './Privacy'
import '../../index.css'
import './profile.css'

export default class Profile extends Component {
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
            displayEdition: 'profile-edition-close'
        }

        this.changePassword = this.changePassword.bind(this)
        this.editAndSave = this.editAndSave.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.ProPicUpdated = this.ProPicUpdated.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    pictureFormRef = React.createRef()
    modalPicUpdRef = React.createRef()
    modalPassUpdRef = React.createRef()

    componentDidMount() {
        this.getProfile(this.props.context.state.user)
        socket.on('updatedUser', () => {
            this.getProfile(this.props.context.state.user)
        })
    }

    getProfile(propUser) {
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
            cellphone = null
        } = propUser
        const profilePicture = window.localStorage.getItem('profileImage')
        this.setState({
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
            cellphone,
            profilePicture: profilePicture,
            editForm: false,
            submitError: '',
            editStyle: "profile_edit",
            maxChar: ''
        })
    }

    ProPicUpdated() {
        const profilePicture = window.localStorage.getItem('profileImage')
        this.setState({
            profilePicture
        })
    }

    editAndSave() {
        this.setState({
            editForm: true,
            displayEdition: 'profile-edition-show'
        })
    }

    closeEdit() {
        this.setState({
            editForm: false,
            displayEdition: 'profile-edition-close'
        })
    }

    changePassword() {
        this.setState({
            modalChangePassword: true
        })
    }

    render() {
        return (
            <div className="bg">
                <div className="profile-container">
                    {/* Profile beggins */}
                    <div className={this.state.displayEdition}>
                        <ProfileEdit
                            closeEdit={this.closeEdit}
                            state={this.state}
                        />
                    </div>
                    <FontAwesomeIcon
                        type="button"
                        className="profile-icon-privacy"
                        name="modalPicture"
                        icon={faInfoCircle}
                        size='2x'
                        color='#BFBBBA'
                    />

                    <Privacy />
                    <Card className="profile-card bg-transparent">
                        <Card.Body clasName="profile-card-body">
                            <div className="profile-picture-div">
                                <Image
                                    className="profile-picture"
                                    roundedCircle={true}
                                    src={`data:image;base64,` + this.state.profilePicture}
                                />
                                <Card.ImgOverlay className="profile-icon-img">
                                    {this.props.context.state.user.dataValidation
                                        ? <FontAwesomeIcon
                                            type="button"
                                            name="modalPicture"
                                            onClick={() => { this.modalPicUpdRef.current.show() }}
                                            icon={faEdit} size='2x' color='#BFBBBA'
                                        />
                                        : <p className="profile-img-validText">
                                            Cuando tu perfil se apruebe podras cambiar tu foto.
                                            </p>
                                    }
                                </Card.ImgOverlay>
                            </div>
                            {/* NICKNAME */}

                            <Card.Title
                                className={!this.state.editForm
                                    ? "nickname-profile text-center"
                                    : "nickname-profile-close text-center"}
                            >
                                {this.state.nickname}
                            </Card.Title>

                            {/* EDITBUTTON */}
                            <div className="profile-edit-icon text-center">
                                {this.props.context.state.user.dataValidation
                                    ? <FontAwesomeIcon
                                        type="button"
                                        hidden={this.state.editForm}
                                        onClick={this.editAndSave}
                                        icon={faEdit}
                                        size='lg'
                                    />
                                    : <p className="profile-edit-pending text-danger">
                                        Perfil pendiente de validación.
                                            </p>
                                }
                            </div>
                            {/* NAME */}
                            <Card.Subtitle
                                className={!this.state.editForm
                                    ? "name-profile text-center"
                                    : "name-profile-close text-center"}>
                                {this.state.name}
                            </Card.Subtitle>
                            {/* LASTNAME */}
                            <Card.Subtitle
                                id="lastName-subtitle"
                                className={!this.state.editForm
                                    ? "lastName-profile text-center"
                                    : "lastName-profile-close text-center"}
                            >
                                {this.state.lastName}
                            </Card.Subtitle>
                            {/* EMAIL */}
                            <Card.Text
                                className={!this.state.editForm
                                    ? "mail-profile text-center"
                                    : "mail-profile-close text-center"}
                            >
                                {this.state.mail}
                            </Card.Text>
                            <Card.Img
                                className=" profile-kanjis"
                                src={kanjis}
                            />
                            {/* PASSWORD */}
                            <Card.Text
                                type="button"
                                className="profile-password text-primary"
                                onClick={() => { this.modalPassUpdRef.current.show() }}
                            >
                                Change password
                            </Card.Text>
                            {/* BIRTHDAY */}
                            <Card.Text className="profile-birthday-title">
                                Fecha de Nacimiento
                                </Card.Text>
                            <Card.Text
                                className={!this.state.editForm
                                    ? "profile-birthday text-center"
                                    : "profile-birthday-close text-center"
                                }
                            >
                                {this.state.birthDate}
                            </Card.Text>
                            {/* INITIALDATA */}
                            <Card.Text className="profile-initialDate-title">
                                Fecha de Inicio de Práctica
                                </Card.Text>
                            <Card.Text
                                className={!this.state.editForm
                                    ? "profile-initialDate text-center"
                                    : "profile-initialDate-close text-center"
                                }
                            >{this.state.initialDate}</Card.Text>
                            {/* INSTRUCTOR */}
                            <Card.Text className="profile-instructor-title">
                                Instructor
                                </Card.Text>
                            <Card.Text
                                className={!this.state.editForm
                                    ? "profile-instructor text-center"
                                    : "profile-instructor-close text-center"
                                }
                            >
                                {this.state.instructor}
                            </Card.Text>
                            {/* DOJO */}
                            <Card.Text className="profile-dojo-title">
                                Dojo
                                </Card.Text>
                            <Card.Text
                                className={!this.state.editForm
                                    ? "profile-dojo text-center"
                                    : "profile-dojo-close text-center"}
                            >
                                {this.state.dojo}
                            </Card.Text>
                            {/* RANK */}
                            <Card.Text className="profile-rank-title">
                                Graduación
                            </Card.Text>
                            <Card.Text
                                className={!this.state.editForm
                                    ? "profile-rank text-center"
                                    : "profile-rank-close text-center"
                                }
                            >
                                {this.state.rank}
                            </Card.Text>
                            {/* CELLPHONE */}
                            <Card.Text className="profile-cellphone-title">
                                Celular
                            </Card.Text>
                            <Card.Text
                                className={!this.state.editForm
                                    ? "profile-cellphone text-center"
                                    : "profile-cellphone-close text-center"
                                }
                            >
                                {this.state.cellphone}
                            </Card.Text>
                            {/* ABOUTME */}
                            <Card.Text className="profile-aboutMe-title">
                                Sobre mí
                            </Card.Text>
                            <Card.Text
                                className={!this.state.editForm
                                    ? "profile-aboutMe text-secondary text-justify"
                                    : "profile-aboutMe-close text-secondary text-justify"
                                }
                            >
                                {this.state.aboutMe}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    {/* Modal ProfilePicture Update */}
                    <ModalForm
                        ref={this.modalPicUpdRef}
                        title="Selecciona una imagen para tu perfil"
                    >
                        <PropPicUpdForm ProPicUpdated={this.ProPicUpdated} />
                    </ModalForm>
                    {/* Modal changePassword */}
                    <ModalForm
                        title="Actualizar contraseña"
                        ref={this.modalPassUpdRef}
                    >
                        <PasswordUpd />
                    </ModalForm>
                </div>
            </div>
        )
    }
}
