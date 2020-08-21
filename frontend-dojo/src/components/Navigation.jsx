import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ModalForm from './ModalForm'
import LoginForm from './Forms/LoginForm'
import SignupForms from './Forms/SignupForms'
import ModalAlert from './ModalAlert'
import Contact from './navComponents/Contact'
import WhatsIsAikido from './navComponents/WhatsIsAikido'
import { socket } from '../App'
import './navigation.css'
export default class Navigation extends Component {
    constructor(props) {
        super(props)

        this.logOut = this.logOut.bind(this)
        this.renderModal = this.renderModal.bind(this)
        this.openContact = this.openContact.bind(this)
        this.openWhatIsAikido = this.openWhatIsAikido.bind(this)

        this.state = {
            nickname: '',
            isAuthenticated: false,
            validated: false,
            isInstructor: false,
            currentLocation: '',
            openContact: false,
            openWhatIsAikido: false
        }
    }

    modalLoginRef = React.createRef()
    modalSignupProcessRef = React.createRef()
    modalLogoutRef = React.createRef()

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            this.setState({
                isAuthenticated: this.props.user.isAuthenticated,
                nickname: this.props.user.nickname,
                validated: this.props.user.dataValidation,
                isInstructor: this.props.user.isInstructor
            })
        }
    }

    UNSAFE_componentWillMount() {
        socket.on('forceLogOut', (data) => {
            this.logOut()
            alert(data)
        })
        this.setState({
            isAuthenticated: this.props.user.isAuthenticated,
            nickname: this.props.user.nickname,
            validated: this.props.user.dataValidation,
            isInstructor: this.props.user.isInstructor
        })
        switch (this.props.location.pathname) {
            case '/blog': this.setState({ currentLocation: 'Blog' })
                break;
            case '/profile': this.setState({ currentLocation: 'Mi perfil' })
                break;
            case '/publications': this.setState({ currentLocation: 'Mis publicaciónes' })
                break;
            case '/rank': this.setState({ currentLocation: 'Mi cinturon' })
                break;
            case '/instructor': this.setState({ currentLocation: 'Alumnos y herramientas' })
                break;
            default: this.setState({ currentLocation: '' })
                break;
        }
    }

    renderModal(event) {
        const name = event.target.name
        if (name === "modalLogin") {
            this.modalLoginRef.current.show()
            setTimeout(() => {
                ReactDOM.findDOMNode(document.getElementById('login_form_field')).focus()
            }, 50)
        }
        if (name === "modalSignup") {
            this.modalSignupProcessRef.current.show()
            setTimeout(() => {
                ReactDOM.findDOMNode(document.getElementById('signup_form_field')).focus()
            }, 50)
        }
    }

    async logOut() {
        const userId = this.props.user.id
        const response = await axios.post('api/users/logout', {userId})
        if (response.status === 200) {
            window.localStorage.removeItem('user')
            window.localStorage.removeItem('profileImage')
            this.setState({
                isAuthenticated: false,
                currentLocation: ''
            })
            this.modalLogoutRef.current.show()
            this.modalLogoutRef.current.victoryClose()
            socket.emit('logOut')
            socket.disconnect()
            this.props.refreshState()
        }
    }

    openContact() {
        if (this.state.openContact) {
            this.setState({
                openContact: false
            })
        } else {
            this.setState({
                openContact: true
            })
        }
    }

    openWhatIsAikido() {
        if (this.state.openWhatIsAikido) {
            this.setState({
                openWhatIsAikido: false
            })
        } else {
            this.setState({
                openWhatIsAikido: true
            })
        }
    }


    render() {

        // Dropdown logged User
        const login = this.state.isAuthenticated
            ? <NavDropdown
                className="navigation-nickname"
                alignRight
                title={this.state.nickname || "Nombre"}
                id="basic-nav-dropdown"
            >
                <NavDropdown.Item
                    href="/profile">
                    Mi Perfil
                    </NavDropdown.Item>
                <NavDropdown.Item
                    disabled={!this.state.validated}
                    href="/rank">
                    Graduación
                      </NavDropdown.Item>
                <NavDropdown.Item
                    hidden={!(this.state.validated && this.state.isInstructor)}
                    href="/instructor">
                    Instructor
                      </NavDropdown.Item>
                <NavDropdown.Item
                    disabled={!this.state.validated}
                    href="/publications">
                    Mis Publicaciones
                    </NavDropdown.Item>
                {/* <NavDropdown.Item
                    disabled={!this.state.validated}
                    href="#action/3.3">
                    Galeria
                    </NavDropdown.Item> */}
                <NavDropdown.Divider />
                <NavDropdown.Item
                    onClick={this.logOut}
                >
                    Salir
                     </NavDropdown.Item>
            </NavDropdown>
            : <Nav>
                <Nav.Link
                    name="modalSignup"
                    className="navigation-signup"
                    onClick={this.renderModal}>
                    Registrarse
                     </Nav.Link>
                <Nav.Link
                    name="modalLogin"
                    className="navigation-login"
                    onClick={this.renderModal}>
                    Ingresar
                    </Nav.Link>
            </Nav>

        return (
            <Navbar
                className="navigation-wrapper"
                bg="transparent"
                expand="lg"
                fixed="top"
            >
                <Fragment>
                    <Navbar.Brand
                        className="navigation-brand"
                        href="/">Jinsei Dojo</Navbar.Brand>
                    <Navbar.Brand
                        className="navigation-currentLocation"
                    >
                        {this.state.currentLocation}
                    </Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                    />
                    <Navbar.Collapse
                        id="basic-navbar-nav"
                    >
                        <Nav
                            className="navigation-homeNav ml-auto"
                        >
                            {window.location.pathname === "/"
                                ? null
                                : <Nav.Link href="/">
                                    <FontAwesomeIcon
                                        icon={faHome}
                                        size='1x'
                                    />
                                </Nav.Link>}
                            <Nav.Link
                                className="navigation-WhatIsAikido"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.federacionaikikaiargentina.org/"
                            >
                                Nuestra federación
                            </Nav.Link>
                            <Nav.Link
                                className="navigation-WhatIsAikido"
                                onClick={this.openWhatIsAikido}
                            >
                                ¿Qué es el Aikido?
                            </Nav.Link>
                            <Nav.Link
                                className="navigation-contactUs"
                                onClick={this.openContact}
                            >
                                Contactanos
                            </Nav.Link>

                            <Nav.Link
                                className="navigation-blog"
                                hidden={!(this.state.validated && this.props.location.pathname !== "/blog")}
                                href="/blog">
                                Blog
                            </Nav.Link>
                            <div>
                                {login}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                    {/* Modal Contact */}
                    <Contact
                        openContact={this.state.openContact}
                        isAuthenticated={this.state.isAuthenticated}
                    />
{/* Modal WhatIsAikido */}
                    <WhatsIsAikido
                        openWhatIsAikido={this.state.openWhatIsAikido}
                    />
                    {/* Modal Login */}
                    <ModalForm
                        backdrop='static'
                        ref={this.modalLoginRef}
                        title="Bienvenid@! Ingresa tus datos"
                    >
                        <LoginForm
                            main={this.props.main}
                        />
                    </ModalForm>
                    {/* Modal Signup */}
                    <ModalForm
                        backdrop='static'
                        ref={this.modalSignupProcessRef}
                        title="Bienvenid@! Registrate para acceder a todo el contenido"
                        size="lg"
                    >
                        <SignupForms
                            main={this.props.main}
                        />
                    </ModalForm>
                    {/* MODAL LOGOUT */}
                    <ModalAlert
                        dialogClassName="navigation-logout"
                        customStyles="navigation-logout-custom"
                        ref={this.modalLogoutRef}
                    />
                </Fragment>
            </Navbar >
        )
    }
}
