import React, { useState, useEffect, useRef, Fragment } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ButtonDinamic from '../../ButtonDinamic'

import './glossary.css'

export default function Glossary() {
    const buttonAttacksRef = useRef('attack')
    const buttonTechniqueRef = useRef(null)
    const buttonExerciseRef = useRef(null)
    const buttonWeaponsRef = useRef(null)
    const buttonNumbersRef = useRef(null)

    const [glossary, setGlossary] = useState([])
    const [currentSearch, setCurrentSearch] = useState([])
    const [currentFilter, setCurrentFilter] = useState(null)
    const [filterGlossary, setfilterGlossary] = useState([])

    useEffect(() => {
        async function getGlossary() {
            try {
                const { data } = await axios.get('api/glossary/getglossary', { withCredentials: true })
                setGlossary(data[0].entries)
                setCurrentSearch(data[0].entries)
            } catch (err) {
                console.log(err.response)
            }
        }
        getGlossary()
    }, [])

    const handleChange = (e) => {
        const { value } = e.target
        const idx = value.length
        const mayusValue = value.toUpperCase()
        const current = filterGlossary.filter(el =>
            (el.title.slice(0, idx)) === mayusValue
        )
        setCurrentSearch(current)
    }

    const manageFilters = (ref, id) => {
        if (ref !== currentFilter) {
            if (currentFilter !== null) {
                currentFilter.current.persistClickOff()
            }
            ref.current.persistClickOn()
            setCurrentFilter(ref)
            const newFilterSearch = glossary.filter(el => el.category === id)
            setCurrentSearch([...newFilterSearch])
            setfilterGlossary(newFilterSearch)
        }
    }

    const handleFilters = (e) => {
        const filterId = e.target.id
        switch (filterId) {
            case "attack":
                manageFilters(buttonAttacksRef, filterId)
                break;
            case "technique":
                manageFilters(buttonTechniqueRef, filterId)
                break;
            case "exercise":
                manageFilters(buttonExerciseRef, filterId)
                break;
            case "weapons":
                manageFilters(buttonWeaponsRef, filterId)
                break;
            case "numbers":
                manageFilters(buttonNumbersRef, filterId)
                break;
            default:
                setCurrentSearch(glossary)
                if (currentFilter !== null) {
                    currentFilter.current.persistClickOff()
                    setfilterGlossary(glossary)
                    setCurrentFilter(null)
                }
                break;
        }
    }

    return (
        <Fragment>
            <div className="glossary-form-search">
                <Row className="glossary-form-row">
                    <Col className="glossary-form-colH3 col-2">
                        <h3>
                            Buscar
                        </h3>
                    </Col>
                    <Col className="glossary-form-col-Input col-4">
                        <Form.Control
                            onChange={(e) => handleChange(e)}
                            name="search"
                            type="text"
                        />
                    </Col>
                </Row>
            </div>
            <Card className="glossary-card bg-transparent">
                <Card.Body className="glossary-card-body">
                    <div className="glossary-table">
                        <Table borderless={true}>
                            <thead className="glosary-table-thead">
                                <tr>
                                    <th className="glossary-table-th">
                                        Termino
                                    </th>
                                    <th className="glossary-table-th">
                                        Descripción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="glosary-table-body">
                                {currentSearch.map((el, key) => (
                                    <tr key={key}>
                                        <td>
                                            {el.title}
                                        </td>
                                        <td>
                                            {el.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div
                        type="button"
                        className="video-button-down-carousel  text-center"
                    >
                        <ButtonDinamic
                            customStyle="glossary-button-attacks"
                            onClick={(e) => handleFilters(e)}
                            id="attack"
                            ref={buttonAttacksRef}
                            buttonText="Ataques"
                        />
                        <ButtonDinamic
                            customStyle="glossary-button-technique"
                            onClick={(e) => handleFilters(e)}
                            id="technique"
                            ref={buttonTechniqueRef}
                            buttonText="Tecnicas"
                        />
                        <ButtonDinamic
                            customStyle="glossary-button-exercise"
                            onClick={(e) => handleFilters(e)}
                            id="exercise"
                            ref={buttonExerciseRef}
                            buttonText="Ejercicios"
                        />
                        <ButtonDinamic
                            customStyle="glossary-button-weapons"
                            onClick={(e) => handleFilters(e)}
                            id="weapons"
                            ref={buttonWeaponsRef}
                            buttonText="Armas"
                        />
                        <ButtonDinamic
                            customStyle="glossary-button-numbers"
                            onClick={(e) => handleFilters(e)}
                            id="numbers"
                            ref={buttonNumbersRef}
                            buttonText="Numeros"
                        />
                        <ButtonDinamic
                            customStyle="glossary-button-everything"
                            onClick={(e) => handleFilters(e)}
                            id="everything"
                            buttonText="Todo"
                        />
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    )
}
