import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import './filtersCard.css'

export default function FiltersCard(props) {
    const [recents, setRecents] = useState('filtersCard-filters-recents')
    const [olders, setOlders] = useState('filtersCard-filters-olders')
    const [currentSearch, setCurrentSearch] = useState([])

    useEffect(() => {
        if(props.currentSearch) {
            setCurrentSearch(props.currentSearch)
        }
    }, [props.currentSearch])

    const changeFilter = () => {
        if (props.manageFilter !== null) {
            const newArray = currentSearch.reverse()
            props.manageFilter(newArray)
        }
        if (recents === "filtersCard-filters-recents") {
            setRecents("filtersCard-filters-olders ")
            setOlders("filtersCard-filters-recents")
        } else {
            setRecents("filtersCard-filters-recents")
            setOlders("filtersCard-filters-olders")
        }
    }


    return (
        <div 
        className="filtersCard-card-filters"
        >
            <div
             className="filtersCard-form-search-author"
            >
                <h3
                 className="filtersCard-form-h3-author"
                >
                    Autor
                </h3>
                <Form.Control
                    name="author"
                    className="filtersCard-form-input-author"
                    onChange={(e) => props.handleChange(e)}
                    type="text"
                />
            </div>
            <div
             className="filtersCard-form-search-title"
            >
                <h3
                 className="filtersCard-form-h3-title"
                >
                    Titulo
                </h3>
                <Form.Control
                    name="title"
                    className="filtersCard-form-input-title"
                    onChange={(e) => props.handleChange(e)}
                    type="text"
                />
            </div>
            <div 
            className="filtersCard-filters-timeFilter"
            >
                <p 
                className={recents}
                >
                    Mas antiguas
            </p>
                <div 
                className="filtersCard-filters-icon"
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
    )
}
