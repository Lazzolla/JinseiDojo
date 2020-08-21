import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TimeAgo from 'timeago-react'
import { register } from 'timeago.js'
import es from 'timeago.js/lib/lang/es'
import ModalAlert from '../../ModalAlert'
import ModalForm from '../../ModalForm'
import LoginForm from '../../Forms/LoginForm'
import ShowProfile from '../../ShowProfile'
import './pubBoard.css'
import '../../../index.css'

register('es', es)

export default class PubBoard extends Component {  
    constructor(props) {
        super(props)

        this.modalPubBoard = this.modalPubBoard.bind(this)

        this.accordionContent = []

        this.state = {
            publications: [],
            submitError: '',
            showUSer: ''
        }
    }

    modalLoginRef = React.createRef()
    modalUserRef = React.createRef()

    componentDidUpdate(prevProps){
        if(prevProps.latestPub !== this.props.latestPub){
            this.setState({          
                publications: this.props.latestPub
            });
        }
    }

    async UNSAFE_componentWillMount() {
        try {
            const { data } = await axios.get('api/blog/latestpub', { withCredentials: true })
            if (data) {
                this.setState({
                    publications: data
                })
            }
        } catch (err) {
            this.setState({
                submitError: err
            })
        }
    }
    
    modalPubBoard(key, e) {
        if (this.props.isAuthenticated) {
            if(e.target.id === "pubBoard_author" + key) {
                this.setState({
                    showUSer: e.target.innerHTML
                })
                    this.modalUserRef.current.show()
            } else {
            this.accordionContent[key].show()
            }
        } else {
            this.modalLoginRef.current.show()
        }
    }

    render() {
           
        return (
            <Fragment>
                { this.state.publications.length > 0
            ?  this.state.publications.map((pub, i) => (
                    <div 
                    key={i}
                     >
                        <div 
                        type="button" 
                        className="bg-pub-board ml-2 mr-2" 
                        onClick={(e) => this.modalPubBoard(i,e)} 
                        >
                            <Row 
                            className="mt-1 bg-transparent"
                             >
                                <Col 
                                className="col-1"
                                >
                                    <Image
                                        className="board-profile-img flex"
                                        roundedCircle={true}
                                        fluid={true}
                                        src={pub.author.profilePictureLocation} 
                                        />
                                </Col>
                                <Col>
                                    <Card.Text 
                                    className="h2 text-dark text-left ml-4"
                                    >
                                        {pub.title}
                                        </Card.Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col 
                                className="col-4 offset-md-2"
                                >
                                    <Card.Text 
                                    type="button"
                                    id={"pubBoard_author" + i}
                                    onClick={(e) => this.modalPubBoard(i, e)}
                                    className="pubBoard-author text-secondary"
                                    >
                                        {pub.author.nickname}
                                    </Card.Text>
                                </Col>
                            </Row>
                        </div>
                        {/* Modal Publication if auth */}
                        <ModalAlert
                            size="lg"
                            title={pub.title}
                            ref={ref => (this.accordionContent[i] = ref)}
                        >
                            <Card >
                                <Card.Body>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: pub.body
                                        }}
                                        />
                                </Card.Body>
                                <Card.Footer>
                                    <Row>
                                        <Col 
                                        className="ml-2 text-right"
                                        >
                                            <TimeAgo
                                                datetime={pub.created_at}
                                                locale='es'
                                            />
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </ModalAlert>
                    </div>
                ))
            : null }
                {/* Modal in case Not auth */}
                <ModalForm
                    dialogClassName="modal-login-pub"
                    ref={this.modalLoginRef}
                    title="Necesitás ingresar para ver publicaciones"
                >
                <LoginForm />
                </ModalForm>
                {/* Modal User */}
                <ModalAlert
       ref={this.modalUserRef}
       dialogClassName="pubBoard-modalUser"
       customStyles="pubBoard-modalUserCustom"
       backdrop={true}
       size="lg"
       >
        <ShowProfile 
       user={this.state.showUSer}
        />
       </ModalAlert>
            </Fragment>
        )
    }
}

