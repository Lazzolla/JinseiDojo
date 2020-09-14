import React, { Component, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'

import './printProgram.css'

export default class PrintProgram extends Component {

  render() {
    return (
      <Fragment>
        {this.props.program
          ? <Card className="printProgram-card-exam">
            <Card.Body className="printProgram-card-body">
              <Card.Title className="printUserProgram-title text-center mb-3">
                {this.props.program.title}
              </Card.Title>
              <Card.Subtitle className="printProgram-subTitle mb-2 text-center mb-3 text-muted">
                {this.props.program.subTitle}
              </Card.Subtitle>
              <Table
                className="printProgram-table"
                bordered={true}
                striped={true}
              >
                <thead className="printProgram-tableFontSizes">
                  <tr>
                    <th>
                      Ataque
                    </th>
                    <th>
                      Tecnica
                    </th>
                  </tr>
                </thead>
                <tbody className="printProgram-tableFontSizes">
                  {this.props.program.techniques.map((tec, key) => (
                    <tr key={key}>
                      <td>
                        {tec.attack}
                      </td>
                      <td>
                        {tec.technique}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          : null
        }
      </Fragment>
    )
  }
}
