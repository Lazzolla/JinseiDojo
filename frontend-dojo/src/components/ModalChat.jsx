import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'

export default class Chat extends Component {
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
        if (this.props.onExited) {
            this.props.onExited()
        }
        setTimeout(() => {
            this.setState({
                show: false
            })
        }, 1100)
    }

    victoryClose() {
        setTimeout(() => {
            this.close()
        }, 1500)
    }

    render() {
        return (
            <Modal
                onEntered={this.props.onEntered
                    ? () => this.props.onEntered()
                    : undefined}
                onExited={this.props.onExited
                    ? () => this.props.onExited()
                    : undefined}
                animation={this.props.animation}
                className={this.props.className}
                dialogClassName={this.props.dialogClassName}
                backdropClassName={this.props.backdrop}
                size={this.props.size}
                show={this.state.show}
                onHide={this.close}
            >
                <Modal.Body className={this.props.classNameBody}>
                    {this.props.children}
                </Modal.Body>
            </Modal>
        )
    }
}
