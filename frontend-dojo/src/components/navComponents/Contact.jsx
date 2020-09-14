import React, { useRef, useEffect, useState } from 'react'
import Image from 'react-bootstrap/Image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faTimes } from '@fortawesome/free-solid-svg-icons'
import contactBackground from '../../videos/contactBackground.mp4'
import logo from '../../pictures/logos/jinsei.png'
import facebook from '../../pictures/logos/facebook.png'
import instagram from '../../pictures/logos/instagram.png'
import whatsapp from '../../pictures/logos/whatsapp.png'
import gmail from '../../pictures/logos/gmail.png'
import aikidoLogo from '../../pictures/logos/aikidoLogo.png'
import ModalChat from '../ModalChat'
import './contact.css'

export default function Contact(props) {

    const modalContactRef = useRef(null)

	const [modalClassname, setModalClassname] = useState('contact-modal-close')
    const [openButton, setOpenButton] = useState(false)

useEffect(() => {
    if(window.localStorage.getItem('contactModal') === null && !props.isAuthenticated) {
            modalContactRef.current.show()
        setTimeout(() => {
            modalContactRef.current.close()
        }, 10000)
    } else {
        if(window.localStorage.getItem('contactModal') === null && props.isAuthenticated) {
            window.localStorage.setItem('contactModal', true)
        }
        if(window.localStorage.getItem('contactModal') && !props.isAuthenticated) {
            setTimeout(() => {
                window.localStorage.removeItem('contactModal')
            }, 100)
        }
    }
}, [props.isAuthenticated])

    useEffect(() => {
        if(props.openContact !== openButton) {
		setOpenButton(props.openContact)
        modalContactRef.current.show()
        } 
    }, [props.openContact, openButton])

	const onEntered = () => {
		setTimeout(() => {
		setModalClassname('contact-modal-open')
		const bodyRoot = document.getElementById('root')
		bodyRoot.style.transition = '1s ease'
		bodyRoot.style.filter = 'blur(6px)'
	}, 200)
}

	const onExited = () => {
		setModalClassname('contact-modal-close')
		document.getElementById('root').style.filter = 'none'
	}

    return (
        <div className="modal-background">
            <ModalChat
				ref={modalContactRef}
				onEntered={onEntered}
				onExited={onExited}
                animation={true}
                className={modalClassname}
                classNameBody="contact-modal-body"
                dialogClassName="contact-modal-dialog"
                backdrop="contact-modal-backdrop"
            >
                <div className="contact-container">
                <video
                    className="contact-backgroundVideo"
                    id='publicityVideo'
                    autoPlay
                    loop
                    muted
                    preload="auto"
                >
                    <source src={contactBackground} type="video/mp4" />
                </video>
                <div className="contact-marquee-top">
                </div>
                <FontAwesomeIcon
                                className="contact-closeIcon"
                                type="button"
                                icon={faTimes}
                                size='lg'
                                onClick={() => modalContactRef.current.close()}
                            />
                <p className="contact-title-welcome">
                    Bienvenido a Jinsei Dojo
                </p>
                <Image
                    className="contact-title-logo"
                    roundedCircle={true}
                    fluid={true}
                    src={logo}
                />
                <div className="contact-marquee-bottom">
                    <Image
                        className="contact-title-aikidoLogo"
                        fluid={true}
                        src={aikidoLogo}
                    />
                </div>
                <div>
                    <div className="contact-title-socialNetworks">
                        <div className="contact-title-facebook">
                            <Image
                                className="contact-title-facebookLogo"
                                fluid={true}
                                src={facebook}
                            />
                            <a
                                className="contact-title-facebookLink"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.facebook.com/aikido.laplata.jinseidojo/">
                                facebook.com/aikido.laplata.jinseidojo/
                             </a>
                        </div>
                        <div className="contact-title-instagram">
                            <Image
                                className="contact-title-instagramLogo"
                                fluid={true}
                                src={instagram}
                            />
                            <a
                                className="contact-title-instagramLink"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.instagram.com/aikido.jinseidojo.laplata/">
                                instagram.com/aikido.jinseidojo.laplata/
                             </a>
                        </div>
                        <div className="contact-title-whatsapp">
                            <Image
                                className="contact-title-whatsappLogo"
                                fluid={true}
                                src={whatsapp}
                            />
                            <p className="contact-title-whatsappLink">
                                +54 9 221 641 1370
                            </p>
                        </div>
                    </div>
                </div>
                <div className="contact-title-gmail">
                    <Image
                        className="contact-title-gmailLogo"
                        fluid={true}
                        src={gmail}
                    />
                    <p className="contact-title-gmailLink">
                        jinseidojolaplata@gmail.com
                    </p>
                </div>
                <div className="contact-title-addressDiv">
                    <FontAwesomeIcon
                        className="contact-title-addressLogo"
                        icon={faHome}
                    />
                    <p className="contact-title-address">
                       Calle 48 e/5 y 6 N° 524
                       La Plata, Buenos Aires, Argentina
                    </p>
                </div>
                </div>
            </ModalChat>
        </div>
    )
}
