import React, { Fragment, useState, useEffect, useRef, useContext } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { useReactToPrint } from "react-to-print"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import SelectExamTechniques from './SelectExamTechniques'
import ButtonDinamic from '../../ButtonDinamic'
import PrintUserProgram from './PrintUserProgram'
import { GralContext } from '../../../App'
import './exam.css'
import './userProgram.css'

export default function UserProgram(props) {
    const context = useContext(GralContext)

    const buttonRefSubmit = useRef(null)
    const printUserProgramRef = useRef()
    const [title, setTitle] = useState('')
    const [selectedFields, setSelectedFields] = useState(null)
    const [userProgram, setUserProgram] = useState([])
    const [printFinal, setPrintFinal] = useState([])

    useEffect(() => {
        if (props.userProgram) {
            setTitle(props.title)
            if (props.userProgram[0]) {
                setUserProgram(props.userProgram[0].techniques)
            }
        }
    }, [props.userProgram, props.title])

    useEffect(() => {
        userProgram.forEach(field => {
            const idAttack = field.name.slice(0, -1)
            if (props.kyu) {
                document.getElementById(idAttack + "4")[field.index].disabled = true
                document.getElementById(idAttack + "5")[field.index].disabled = true
                document.getElementById(idAttack + "6")[field.index].disabled = true
            } else {
                document.getElementById(idAttack + "1")[field.index].disabled = true
                document.getElementById(idAttack + "2")[field.index].disabled = true
                document.getElementById(idAttack + "3")[field.index].disabled = true
            }
            document.getElementById(field.name).value = field.value
        })
        setSelectedFields(userProgram)
    }, [userProgram, props.kyu])

    const handlePrint = useReactToPrint({
        content: () => printUserProgramRef.current
    })

    const printProgram = (event) => {
        const newArray = selectedFields.map((el) => {
            const tech = {
                name: el.name.slice(0, -1),
                value: el.value
            }
            return tech
        })
        setPrintFinal(newArray)
        submitProgram(event)
        setTimeout(() => {
            handlePrint()
        }, 500)
    }

    const handleChange = (event) => {
        const { value, id } = event.target
        const idAttack = id.slice(0, -1)
        const selectItem = ReactDOM.findDOMNode(document.getElementById(id))
        // FIND INDEX FOR OPTION SELECTED
        const index = selectItem.selectedOptions[0].index
        // SELECT THE THREE FIELDS
        let one,
            two,
            three
        if (props.kyu) {
            one = ReactDOM.findDOMNode(document.getElementById(idAttack + "4"))
            two = ReactDOM.findDOMNode(document.getElementById(idAttack + "5"))
            three = ReactDOM.findDOMNode(document.getElementById(idAttack + "6"))
        } else {
            one = ReactDOM.findDOMNode(document.getElementById(idAttack + "1"))
            two = ReactDOM.findDOMNode(document.getElementById(idAttack + "2"))
            three = ReactDOM.findDOMNode(document.getElementById(idAttack + "3"))
        }
        const prevSelect = selectedFields.find(el => el.name === id)

        // ENABLE AND DISABLED FIELDS DYNAMICALLY
        if (prevSelect) {
            one.options[prevSelect.index].disabled = false
            two.options[prevSelect.index].disabled = false
            three.options[prevSelect.index].disabled = false

            one.options[index].disabled = true
            two.options[index].disabled = true
            three.options[index].disabled = true

            setSelectedFields([...(selectedFields.filter(el => el.name !== prevSelect.name)), { name: id, index, value }])
        } else {

            setSelectedFields([...selectedFields, { name: id, index, value }])

            one.options[index].disabled = true
            two.options[index].disabled = true
            three.options[index].disabled = true
        }
    }

    const submitProgram = async (event) => {
        event.preventDefault()
        buttonRefSubmit.current.disabled()
        buttonRefSubmit.current.loading()
        await axios.post('api/programs/userprogram',
            {
                title,
                selectedFields
            },
            { withCredentials: true })
        buttonRefSubmit.current.success()
        setTimeout(() => {
            buttonRefSubmit.current.reset()
        }, 1500)
    }

    return (
        <Fragment>
            <div style={{ display: "none" }}>
                <PrintUserProgram
                    ref={printUserProgramRef}
                    program={printFinal}
                    title={title}
                    name={context.state.user.name}
                    lastName={context.state.user.lastName}
                    kyu={title === "2do Kyu (cinturon azul)"
                        ? true
                        : false
                    }
                />
            </div>
            <Card className="exam-card-exam">
                <FontAwesomeIcon
                    className="exam-card-print-icon"
                    onClick={(event) => printProgram(event)}
                    type="button"
                    icon={faPrint}
                    size='lg'
                />
                <Card.Body
                    id="examProgramBody"
                    className="exam-card-body"
                >
                    <Card.Title className="text-left ml-5 mb-3">
                        Armá tu examen
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-center mb-3 text-muted">
                        Podes guardarlo, imprimirlo y editarlo mas tarde si queres.
                    </Card.Subtitle>
                    <Card.Title className="text-center">
                        {title}
                    </Card.Title>
                    <Form onSubmit={(event) => submitProgram(event)}>
                        <Table
                            className="userProgram-table text-center"
                            size="sm"
                            bordered={true}
                            striped={true}
                        >
                            <tbody>
                                <tr>
                                    <td
                                        className="UserProgram-fonts text-center"
                                        colSpan={3}
                                    >
                                        <strong>
                                            Shomen Uchi
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "shomenUchi4"
                                                : "shomenUchi1"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "shomenUchi5"
                                                : "shomenUchi2"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "shomenUchi6"
                                                : "shomenUchi3"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <strong>
                                            Yokomen Uchi
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "yokomenUchi4"
                                                : "yokomenUchi1"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "yokomenUchi5"
                                                : "yokomenUchi2"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "yokomenUchi6"
                                                : "yokomenUchi3"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <strong>
                                            Ushiro Riotekubidori
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "ushiroRiotekubidori4"
                                                : "ushiroRiotekubidori1"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "ushiroRiotekubidori5"
                                                : "ushiroRiotekubidori2"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "ushiroRiotekubidori6"
                                                : "ushiroRiotekubidori3"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan={3}>
                                        <strong>
                                            Hamni Hantachi Waza
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "hamniHantachiWaza4"
                                                : "hamniHantachiWaza1"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "hamniHantachiWaza5"
                                                : "hamniHantachiWaza2"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    {props.kyu
                                        ? <td>
                                            <SelectExamTechniques
                                                id={"hamniHantachiWaza6"}
                                                handleChange={handleChange}
                                            />
                                        </td>
                                        : <td>
                                            <SelectExamTechniques
                                                hidden={true}
                                                id={"hamniHantachiWaza3"}
                                                handleChange={handleChange}
                                            />
                                        </td>
                                    }
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <strong>
                                            Suwari Waza
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "suwariWaza4"
                                                : "suwariWaza1"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <SelectExamTechniques
                                            id={props.kyu
                                                ? "suwariWaza5"
                                                : "suwariWaza2"}
                                            handleChange={handleChange}
                                        />
                                    </td>
                                    {props.kyu
                                        ? <td>
                                            <SelectExamTechniques
                                                id={"suwariWaza6"}
                                                handleChange={handleChange}
                                            />
                                        </td>
                                        : <td>
                                            <SelectExamTechniques
                                                hidden={true}
                                                id={"suwariWaza3"}
                                                handleChange={handleChange}
                                            />
                                        </td>}
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <strong>{props.kyu
                                            ? "Jiyu Waza con 2 ukes"
                                            : "Jiyu Waza"}
                                        </strong>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <div className="userProgram-button-save">
                            <ButtonDinamic
                                customStyle="userProgram-button-style"
                                styleSpinner="userProgram-button-spinner"
                                stylePrimaryText="userProgram-button-primaryText"
                                styleSecondaryText="userProgram-button-secondaryText"
                                successText="Guardado"
                                buttonText="Guardar"
                                type="submit"
                                size="btn-lg"
                                spinnerSize="lg"
                                ref={buttonRefSubmit}
                            />
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Fragment>
    )
}
