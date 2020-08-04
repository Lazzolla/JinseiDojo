import React, { useState, Fragment, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import PublishCard from './PublishCard'
import { socket } from '../../App'
import './blog.css'

export default function Blog() {
  const [publications, setPublications] = useState([])
  const [currentSearch, setCurrentSearch] = useState([])
  const [displayError, setDisplayError] = useState('')
  const [recents, setRecents] = useState('blog-filters-recents')
  const [olders, setOlders] = useState('blog-filters-olders')

  useEffect(() => {
    socket.on('latestPubUpdated', () => {
      getPublications()
    })
    async function getPublications() {
      try {
        const { data } = await axios.get('api/blog/getpublications', { withCredentials: true })
        setPublications(data)
        setCurrentSearch(data.reverse())
      } catch (err) {
        setTimeout(() => {
          setDisplayError(err.response.data.message)
        }, 5000)
      }
    }
    getPublications()
  }, [])

  const handleChange = (e) => {
    const { value, name } = e.target
    const idx = value.length
    const lowerValue = value.toLowerCase()
    if(name === 'title') {
    const currentTitles = publications.filter(el =>
        (el.title.slice(0, idx).toLowerCase()) === lowerValue
    )
    setCurrentSearch(currentTitles)
    } else {
      const currentAuthors = publications.filter(el =>
        (el.author.nickname.slice(0, idx).toLowerCase()) === lowerValue
    )
    setCurrentSearch(currentAuthors)
    }
  }

  const changeFilter = () => { 
    setCurrentSearch(currentSearch.reverse())
    if (recents === "blog-filters-recents") {
      setRecents("blog-filters-olders ")
      setOlders("blog-filters-recents")
    } else {
      setRecents("blog-filters-recents")
      setOlders("blog-filters-olders")
    }
  }


  return (
    <Fragment>
      <div
       className="bg-blog"
      >
        <div 
        className="blog-card-filters"
        >
          <div 
          className="blog-form-search-author"
          >
            <h3
             className="blog-form-h3-author"
            >
              Autor
            </h3>
            <Form.Control
              name="author"
              className="blog-form-input-author"
              onChange={(e) => handleChange(e)}
              type="text"
            />
          </div>
          <div 
          className="blog-form-search-title"
          >
            <h3 
            className="blog-form-h3-title"
            >
              Titulo
            </h3>
            <Form.Control
              name="title"
              className="blog-form-input-title"
              onChange={(e) => handleChange(e)}
              type="text"
            />
          </div>
          <div
           className="blog-filters-timeFilter"
          >
            <p
             className={recents}
            >
            Mas antiguas
            </p>
            <div
             className="blog-filters-icon"
            >
              <FontAwesomeIcon
                type="button"
                icon={faSort}
                onClick={() => changeFilter()}
                size='3x'
              />
            </div>
            <p 
            className={olders}
            >
            Mas recientes
             </p>
          </div>
        </div>
        <div
         className="blog-card"
        >
        <h1 
          className="blog-title-gral"
          >
            Todas las publicaciones
          </h1>
          { displayError.length > 0
        ?  <h4
          className="blog-subtitle-gral text-danger"
          >
            {displayError}
          </h4>  
        :  <h4
          type="button"
          onClick={() => window.location.href='/publications'}
          className="blog-subtitle-gral"
          >
            Escribí una publicación para compartir con la comunidad
            </h4>
}
          <div 
          className="blog-container"
          >
            {
              currentSearch
                ? currentSearch.map((pub, key) => (
                  <PublishCard
                    key={key}
                    pub={pub}
                    userShow={true}
                    userPicture={true}
                  />
                ))
                : null
            }
          </div>
        </div>
      </div>
    </Fragment>
  )
}
