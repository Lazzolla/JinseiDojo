import React, { Component, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'

import './printUserProgram.css'

export default class PrintUserProgram extends Component {

    render() {
        return (
            <Fragment>
                {this.props.program
                    ? <Card className="printUserProgram-card-exam">
                        <Card.Body className="printUserProgram-card-body">
                            <Card.Title className="printUserProgram-title text-center mb-3">
                                {this.props.title}
                            </Card.Title>
                            <Card.Subtitle className="printUserProgram-subTitle mb-2 text-center mb-3 text-muted">
                                {this.props.name + " " + this.props.lastName}
                            </Card.Subtitle>
                            <Table
                                className="printUserProgram-table"
                                bordered={true}
                                striped={true}
                            >
                                <tbody className="printUserProgram-tableFontSizes text-center">
                                    <tr>
                                        <td colSpan={3}>
                                            <strong>
                                                Shomen Uchi
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        {this.props.program
                                            ? this.props.program.map((el) => (
                                                el.name === "shomenUchi"
                                                    ? <td>
                                                        {el.value}
                                                    </td>
                                                    : null

                                            ))
                                            : null
                                        }
                                    </tr>
                                    <tr>
                                        <td colSpan={3}>
                                            <strong>
                                                Yokomen Uchi
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        {this.props.program
                                            ? this.props.program.map((el) => (
                                                el.name === "yokomenUchi"
                                                    ? <td>
                                                        {el.value}
                                                    </td>
                                                    : null
                                            ))
                                            : null
                                        }
                                    </tr>
                                    <tr>
                                        <td colSpan={3}>
                                            <strong>
                                                Ushiro Riotekubidori
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        {this.props.program
                                            ? this.props.program.map((el) => (
                                                el.name === "ushiroRiotekubidori"
                                                    ? <td>
                                                        {el.value}
                                                    </td>
                                                    : null
                                            ))
                                            : null
                                        }
                                    </tr>
                                    <tr>
                                        <td colSpan={3}>
                                            <strong>
                                                Hamni Hantachi Waza
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        {this.props.program
                                            ? this.props.program.map((el) => (
                                                el.name === "hamniHantachiWaza"
                                                    ? <td>
                                                        {el.value}
                                                    </td>
                                                    : null
                                            ))
                                            : null
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
                                        {this.props.program
                                            ? this.props.program.map((el) => (
                                                el.name === "suwariWaza"
                                                    ? <td>
                                                        {el.value}
                                                    </td>
                                                    : null
                                            ))
                                            : null
                                        }
                                    </tr>
                                    <tr>
                                        <td colSpan={3}>
                                            <strong>
                                                {this.props.kyu
                                                    ? "Jiyu Waza"
                                                    : "Jiyu Waza con 2 ukes"
                                                }
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    : null}
            </Fragment>
        )
    }
}
