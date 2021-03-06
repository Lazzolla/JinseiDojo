import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { getRanksList } from '../../../Helpers/DataConvertions'
import CarouselItem from '../../rank/videos/CarouselItem'
import ModalAlert from '../../ModalAlert'
import ButtonDinamic from '../../ButtonDinamic'
import VideoTable from './VideoTable'

import './instructorVideos.css'

export default function InstructorVideos() {
    const buttonRefSave = useRef(null)
    const buttonRefCancel = useRef(null)
    const modalWarningRef = useRef(null)
    const ButtonSaveBoardRef = useRef(null)

    const [index, setIndex] = useState(0)
    const [ranks, setRanks] = useState([])
    const [currentTitle, setCurrentTitle] = useState('6to Kyu (cinturon blanco)')
    const [links, setLinks] = useState([[{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }], [{ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' }]])

    useEffect(() => {
        async function getVideos() {
            try {
                const { data } = await axios.get('api/instructor/getvideoslist', { withCredentials: true })
                setLinks(data)
            } catch (err) {
                console.log(err.response.data.message)
            }
        }
        getVideos()
        setRanks(getRanksList())
    }, [])

    const getRefresh = async () => {
        try {
            const { data } = await axios.get('api/instructor/getvideoslist', { withCredentials: true })
            setLinks(data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = e => {
        const { value } = e.target
        setIndex(value)
        setCurrentTitle(e.target.options[value].innerHTML)
        if (document.getElementById('instructorVideosInputTitle') && document.getElementById('instructorVideosInputUrl')) {
            document.getElementById('instructorVideosInputTitle').value = ''
            document.getElementById('instructorVideosInputUrl').value = ''
        }
    }

    const handleUpdates = (e, key) => {
        const { name, value } = e.target
        Object.assign(links[index][key], { [name]: value })
        setLinks([...links])
    }

    const addNewVideo = () => {
        links[index].push({ 'title': 'Elije un titulo para tu video', 'url': 'Ingresa la URL de tu video' })
        setLinks([...links])
    }

    const removeVideo = key => {
        const remainingVideos = links[index].filter(el => el.url !== links[index][key].url)
        links[index] = remainingVideos
        setLinks([...links])
    }

    const saveVideos = async () => {
        buttonRefCancel.current.disabled()
        buttonRefSave.current.loading()
        buttonRefSave.current.disabled()
        try {
            await axios.put('api/instructor/savevideoslist', { links }, { withCredentials: true })
            buttonRefSave.current.success()
            modalWarningRef.current.victoryClose()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        index !== null
            ? <Card className="instructorVideos-card bg-transparent">
                <Card.Body className="instructorVideos-body">
                    <Form className="instructorVideos-form">
                        <Form.Control
                            className="instructorVideos-selectBelt"
                            as="select"
                            multiple
                            onChange={e => handleChange(e)}
                        >
                            {ranks.map((rank, key) => (
                                <option
                                    key={key}
                                    value={rank.index}
                                >
                                    {rank.rank}
                                </option>

                            ))}
                        </Form.Control>
                        <div className="instructorVideos-divTable overflow-auto">
                            <Table
                                className="instructorVideos-table text-center"
                                bordered={true}
                                striped={true}
                            >
                                <thead>
                                    <tr>
                                        <th colSpan={2}>
                                            Titulo
                                    </th>
                                        <th>
                                            Link
                                        </th>
                                    </tr>
                                </thead>
                                <VideoTable
                                    addNewVideo={addNewVideo}
                                    removeVideo={removeVideo}
                                    handleUpdates={handleUpdates}
                                    links={links[index]}
                                />
                            </Table>
                        </div>
                    </Form>
                    <div className="instructorVideos-videosTitle">
                        <h2>
                            {currentTitle}
                        </h2>
                    </div>
                    <div
                        type="button"
                        onClick={() => getRefresh()}
                        className="instructorVideos-refreshContainer"
                    >
                        <FontAwesomeIcon
                            className="instructorVideos-refreshIcon"
                            icon={faRedo}
                            size='lg'
                        />
                    </div>
                    <div className="instructorVideos-button-save">
                        <ButtonDinamic
                            buttonText="Guardar videos"
                            onClick={() => modalWarningRef.current.show()}
                            ref={ButtonSaveBoardRef}
                        />
                    </div>
                    {/* MODAL SAVE BOARD */}
                    <ModalAlert
                        dialogClassName="custom-dialog"
                        backdrop={true}
                        size="lg"
                        title="¿Estas seguro que queres guardar los videos?"
                        ref={modalWarningRef}
                    >
                        <Card.Text className="text-center h5">
                            Cualquier cambio que hayas hecho no afecta los videos en la cuenta de Youtube.
                        </Card.Text>
                        <Row>
                            <Col>
                                <ButtonDinamic
                                    customStyle=" mt-3 "
                                    buttonText="Mejor no"
                                    onClick={() => modalWarningRef.current.close()}
                                    ref={buttonRefCancel}
                                />
                            </Col>
                            <Col>
                                <ButtonDinamic
                                    customStyle=" mt-3 "
                                    successText="Videos guardados"
                                    buttonText="Guardar videos"
                                    onClick={() => saveVideos()}
                                    ref={buttonRefSave}
                                />
                            </Col>
                        </Row>
                    </ModalAlert>
                    <div className="instructorVideos-carousel">
                        <CarouselItem
                            videosURL={links[index]}
                        />
                    </div>
                </Card.Body>
            </Card>
            : null
    )
}
