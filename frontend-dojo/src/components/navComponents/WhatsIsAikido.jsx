import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import swatDisarmed from '../../pictures/gifs/SwatDisarmed.gif'
import irimiGirl from '../../pictures/gifs/irimiGirl.gif'
import OsenseiShomenUchi from '../../pictures/gifs/OsenseiShomenUchi.gif'
import jinseiDojoPractice from '../../videos/practice.mp4'
import ModalChat from '../ModalChat'
import './whatIsAikido.css'

export default function WhatsIsAikido(props) {

    const [openButton, setOpenButton] = useState(false)

    const modalWhatIsAikidoRef = useRef(null)

    useEffect(() => {
        if (props.openWhatIsAikido !== openButton) {
            setOpenButton(props.openWhatIsAikido)
            modalWhatIsAikidoRef.current.show()
        }
    }, [props.openWhatIsAikido, openButton])

    return (
        <ModalChat
            ref={modalWhatIsAikidoRef}
            animation={true}
            className="whatsIsAikido-modal-gral"
            classNameBody="whatIsAikido-modal-body"
            dialogClassName="whatIsAikido-modal-dialog"
            backdrop="whatIsAikido-modal-backdrop"
        >
            <Card
                className="whatIsAikido-card bg-transparent"
            >
                <Card.Body>
                <FontAwesomeIcon
                                className="whatIsAikido-closeIcon"
                                type="button"
                                icon={faTimes}
                                size='lg'
                                onClick={() => modalWhatIsAikidoRef.current.close()}
                            />
                    <Card.Title 
                    className="whatIsAikido-card-title text-center"
                    >
                        ¿Qué es el Aikido?
                    </Card.Title>
                    <Card.Text
                    className="whatIsAikido-firstText"
                    >
                        Aikido es un arte marcial de origen japonés, que busca disuadir al adversario y neutralizar su intención agresiva, más que derrotarlo.
    </Card.Text>
                    <div
                        className="whatIsAikido-img-first-div"
                    >
                        <Image
                            className="whatIsAikido-img-first"
                            fluid={true}
                            src={swatDisarmed}
                        />
                    </div>
                    <Card.Text 
                    className="whatIsAikido-secondText"
                    >
                        La unidad, la armonía y la paz interior son la esencia del Aikido, que no solo permite la defensa personal, sino el dominio del cuerpo.
                        Uno de los principios más importantes de esta disciplina es el que sostiene que la mente y el cuerpo son uno. Cuando la persona actúa teniendo esto presente, desarrolla su fuerza interior.
</Card.Text>
                    <div
                        className="whatIsAikido-img-second-div"
                    >
                        <Image
                            className="whatIsAikido-img-second"
                            fluid={true}
                            src={OsenseiShomenUchi}
                        />
                    </div>
                    <Card.Text 
                    className="whatIsAikido-thirdText "
                    >
                        Se caracteriza por aprovechar la fuerza del oponente para redirigir los movimientos de tal manera que se eviten daños letales. Los movimientos de Aikido son de naturaleza circular, adquiriendo flexibilidad y equilibrio, no existe ninguna necesidad de entrar en conflicto con la fuerza del oponente, ya que acompañando el ataque, es posible tomar control de la fuerza que emplea el atacante y redirigirla en forma segura y efectiva.
                        Las técnicas son de naturaleza defensiva, por lo que no se requiere de una personalidad agresiva. No obstante ello, mediante la práctica, la persona se convierte en alguien fuerte y desarrolla mayor seguridad y potencia en sus movimientos.
</Card.Text>
                    <div
                        className="whatIsAikido-img-third-div"
                    >
                        <Image
                            className="whatIsAikido-img-third"
                            fluid={true}
                            src={irimiGirl}
                        />
                    </div>
                    <Card.Text 
                    className="whatIsAikido-fourthText "
                    >
                        El Aikido se practica por parejas, lo que da la posibilidad de aprender del otro, al mismo tiempo que el adversario aprende de vos. Esta apertura mental que caracteriza al ejercicio es la que crea un clima sumamente sano en nuestro Dojo.
    </Card.Text>
                    <video
                        className="whatIsAikido-practiceVideo"
                        autoPlay
                        loop
                        muted
                    >
                        <source src={jinseiDojoPractice} type="video/mp4"
                         />
                    </video>
                </Card.Body>
            </Card>
        </ModalChat>
    )
}
