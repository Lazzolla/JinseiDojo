import React, { useState, useEffect, useRef, Fragment } from 'react'
import axios from 'axios'
import { useReactToPrint } from "react-to-print"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card'
import Carousel from 'react-bootstrap/Carousel'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import ExamTechniques from './ExamTechniques'
import PrintProgram from './PrintProgram'
import UserProgram from './UserProgram'
import attacks from '../../../pictures/attacks/attacks.png'

import './exam.css'

export default function Exam() {
  const printProgramRef = useRef()
  const [examPrograms, setExamPrograms] = useState([])
  const [userExamsPrograms, setUserExamsPrograms] = useState([])
  const [currentProgram, setCurrentProgram] = useState(null)

  useEffect(() => {
    async function getExams() {
      const { data } = await axios.get('api/programs/getprograms', { withCredentials: true })
      setExamPrograms(data)
      const response = await axios.get('api/programs/getuserprograms', { withCredentials: true })
      setUserExamsPrograms(response.data)
    }
    getExams()
  }, [])

  const handlePrint = useReactToPrint({
    content: () => printProgramRef.current
  })

  const printProgram = (key) => {
    setCurrentProgram(examPrograms[key])
    setTimeout(() => {
      handlePrint()
    }, 50)
  }

  return (
    <Fragment>
      <div style={{ display: "none" }}>
        <PrintProgram
          program={currentProgram}
          ref={printProgramRef}
        />
      </div>
      <div
        className="exam-bg-beltColor"
        id="videos_bg_belts"
      >
        <div>
        </div>
        <Carousel
          className="exam-carousel "
          indicators={false}
          interval={null}
          nextIcon={
            <span
              aria-hidden="true"
              className="exam-horizontal-nextIcon carousel-control-next-icon"
            />
          }
          prevIcon={
            <span
              aria-hidden="true"
              className="exam-horizontal-prevIcon carousel-control-prev-icon"
            />
          }
        >
          {examPrograms.map((exam, key) => (
            <Carousel.Item
              key={key}
              className="exam-carousel-item"
            >
              <Row className="exam-item-row">
                <Col className="exam-item-col col-6 ">
                  {key < 3
                    ? <Card className="exam-card-exam">
                      <Card.Body>
                        <Card.Title className="text-left ml-5 mb-3">
                          Principales Ataques
                          </Card.Title>
                        <Card.Img
                          className="exam-attacks-img"
                          src={attacks}
                        />
                      </Card.Body>
                    </Card>
                    : <UserProgram
                      kyu={
                        key < 4
                          ? false
                          : true
                      }
                      title={exam.title}
                      userProgram={userExamsPrograms
                        ? key < 4
                          ? userExamsPrograms.filter(program => program.title === "2do Kyu (cinturon azul)")
                          : userExamsPrograms.filter(program => program.title === "1er Kyu (cinturon marron)")
                        : null}
                    />}
                </Col>
                <Col className="exam-item-col col-6 ">
                  <Card className="exam-card-exam">
                    <FontAwesomeIcon
                      className="exam-card-print-icon"
                      onClick={() => printProgram(key)} type="button" icon={faPrint} size='lg'
                    />
                    <Card.Body
                      id="examProgramBody"
                      className="exam-card-body"
                    >
                      <Card.Title
                        className="text-center mb-3">
                        {exam.title}
                      </Card.Title>
                      <Card.Subtitle
                        className="mb-2 text-center mb-3 text-muted">
                        {exam.subTitle}
                      </Card.Subtitle>
                      <Table
                        bordered={true}
                        striped={true}
                      >
                        <thead>
                          <tr>
                            <th>
                              Ataque
                              </th>
                            <th>
                              Tecnica
                              </th>
                          </tr>
                        </thead>
                        <ExamTechniques
                          techniques={exam.techniques}
                        />
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </Fragment>
  )
}
