import React, { Component} from 'react'
import Modal from 'react-bootstrap/Modal'

import './modalAlert.css'

export default class ModalAlert extends Component {
    constructor(props) {
        super(props)

        this.show = this.show.bind(this)
        this.close = this.close.bind(this)
        this.victoryClose = this.victoryClose.bind(this)

        this.state = {
            show: false
        }
    }

    show() {
        this.setState({
            show: true
        })
    }


    close() {
       this.setState({
           show: false
       })
    }

    victoryClose() {
        setTimeout(() => {
            this.close()
        }, 1500)
    }

    render() {
        return (
            <Modal
            className={" modalAlert-gral " + this.props.customStyles}
            dialogClassName={this.props.dialogClassName}
            backdrop={this.props.backdrop} 
            size={this.props.size} 
            show={this.state.show} 
            onHide={this.close} 
            animation={true} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.props.title}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {this.props.children}
                </Modal.Body>
            </Modal>
        )
    }
}
