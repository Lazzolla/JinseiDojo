import React, { Component } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import './buttonDinamic.css'

export default class ButtonDinamic extends Component {
    constructor(props) {
        super(props)

        this.success = this.success.bind(this)
        this.loading = this.loading.bind(this)
        this.reset = this.reset.bind(this)
        this.disabled = this.disabled.bind(this)
        this.persistClickOn = this.persistClickOn.bind(this)
        this.persistClickOff = this.persistClickOff.bind(this)
        this.persistFilter = this.persistFilter.bind(this)

        this.state = {
            success: false,
            loading: false,
            disabled: false,
            className: " btn-block d-inline ",
            persistClick: " buttonDinamic "
        }
    }

    UNSAFE_componentWillMount() {
        if (this.props.persistClickDefault) {
            this.setState({
                persistClick: " persistClick "
            })
        }
    }

    // FOR TABS

    persistClickOn() {
        this.setState({
            persistClick: " persistClick "
        })
    }

    persistClickOff() {
        this.setState({
            persistClick: " buttonDinamic "
        })
    }

    // FOR FILTERS

    persistFilter() {
        if (this.state.persistClick === " buttonDinamic ") {
            this.setState({
                persistClick: " persistClick "
            })
        } else {
            this.setState({
                persistClick: " buttonDinamic "
            })
        }
    }

    success() {
        this.setState({
            success: true,
            loading: false
        })
    }

    loading() {
        this.setState({
            disabled: true,
            loading: true
        })
    }

    disabled() {
        this.setState({
            disabled: true
        })
    }

    reset() {
        this.setState({
            disabled: false,
            loading: false,
            success: false
        })
    }
    render() {
        const size = this.props.size
        const button = <button
            onClick={this.props.onClick}
            className={size + this.state.className + this.props.customStyle + this.state.persistClick}
            disabled={this.state.disabled}
            type={this.props.type}
            name={this.props.name}
        >
            {this.state.loading
                ? <Spinner
                    as="span"
                    animation="border"
                    className={this.props.styleSpinner || "buttonDinamic-spinner"}
                    size={this.props.spinnerSize}
                    role="status"
                    aria-hidden="true" />
                : this.state.success
                    ? <div >
                        <h3
                            className={this.props.styleSecondaryText || "buttonDinamic-secondaryText"}
                        >
                            {this.props.successText}
                        </h3>
                    </div>
                    : <div >
                        <h3
                            id={this.props.id}
                            className={this.props.stylePrimaryText || "buttonDinamic-primaryText"}
                        >
                            {this.props.buttonText}
                        </h3>
                    </div>
            }
        </button>

        return (
            <div>
                {button}
            </div>
        )
    }
}
