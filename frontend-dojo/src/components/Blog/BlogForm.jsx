import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import PublishCard from './PublishCard'
import './blogForm.css'

export default class BlogForm extends Component {
  constructor(props) {
    super(props)

    this.getPublications = this.getPublications.bind(this)
    this.changeFilter = this.changeFilter.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      publications: [],
      currentSearch: [],
      recents: 'blog-filters-recents',
      olders: 'blog-filters-olders'
    }
  }

  componentDidMount() {
    this.getPublications()
  }

  async getPublications() {
    try {
      const { data } = await axios.get('api/blog/publications', { withCredentials: true })
      this.setState({
        publications: data,
        currentSearch: data.reverse()
      })
    } catch (err) {
      this.setState({
        submitError: err.response.data.message
      })
    }
  }

  handleChange(e) {
    const { value } = e.target
    const idx = value.length
    const lowerValue = value.toLowerCase()
    const currentTitles = this.state.publications.filter(el =>
      (el.title.slice(0, idx).toLowerCase()) === lowerValue)
    this.setState({
      currentSearch: currentTitles
    })
  }

  changeFilter() {
    if (this.state.recents === "blog-filters-recents") {
      this.setState({
        currentSearch: this.state.currentSearch.reverse(),
        recents: "blog-filters-olders",
        olders: "blog-filters-recents"
      })
    } else {
      this.setState({
        currentSearch: this.state.currentSearch.reverse(),
        recents: "blog-filters-recents",
        olders: "blog-filters-olders"
      })
    }
  }

  render() {
    return (
      <Fragment>
        <div className="blogForm-container">
          <div className="blogForm-row">
            {
              this.state.currentSearch
                ? this.state.currentSearch.map((pub, key) => (
                  <PublishCard
                    getPublications={this.getPublications}
                    deleteOption={true}
                    key={key}
                    pub={pub}
                  />
                ))
                : null
            }
          </div>
        </div>
        <div className="blogForm-card-filters">
          <div className="blogForm-form-search-title">
            <h3 className="blogForm-form-h3-title">
              Titulo
            </h3>
            <Form.Control
              name="title"
              className="blogForm-form-input-title"
              onChange={e => this.handleChange(e)}
              type="text"
            />
          </div>
          <div className="blogForm-filters-timeFilter">
            <p className={this.state.recents}>
              Mas antiguas
        </p>
            <div className="blogForm-filters-icon">
              <FontAwesomeIcon
                type="button"
                icon={faSort}
                onClick={() => this.changeFilter()}
                size='3x'
              />
            </div>
            <p className={this.state.olders}>
              Mas recientes
         </p>
          </div>
        </div>
      </Fragment>
    )
  }
}

