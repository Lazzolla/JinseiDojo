import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import './modalForm.css'
export default class ModalForm extends Component {
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

    victoryClose() {
        setTimeout(() => {
            this.close()
        }, 1500)
    }

    close() {
        this.setState({
            show: false
        })
    }

    render() {
        return (
            <Modal
                backdrop={this.props.backdrop}
                onExit={this.props.onExit}
                className="modalForm-gral"
                dialogClassName={this.props.dialogClassName + " modalForm"}
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
                    <div>
                        {React.cloneElement(this.props.children,
                            { victoryClose: this.victoryClose, close: this.close })}
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}
