import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Carousel from 'react-bootstrap/Carousel'
import { socket } from '../../App'

import './carouselBoard.css'

export default function CarouselBoard() {
    const [items, setItems] = useState([])

    useEffect(() => {
        socket.on('boardUpdated', (data) => {
            getBoard()
        })
        async function getBoard() {
            try {
            const { data } = await axios.get('api/board/getboard')
            setItems(data)
            } catch(err) {
                console.log(err.response)
            }
        }
        getBoard()
    }, [])

    return (
        <Carousel
            className="carourselBoard-gral  container-fluid h-auto"
            indicators={false}
            interval={3000}
            nextIcon={
            <span 
            aria-hidden="true"
             className="carouseBoard-nextIcon carousel-control-next-icon"
              />}
            prevIcon={
            <span 
            aria-hidden="true" 
            className="carouseBoard-prevIcon carousel-control-prev-icon" 
            />}
        >
            {items.map((item, key) => (
                <Carousel.Item
                    key={key}
                    className="carourselBoard-item container-fluid h-auto"
                >
                    <div className="carourselBoard-divImg "
                    >
                        <img
                            className="carourselBoard-img  img-fluid d-block"
                            src={item.src}
                            alt={`Item ${key}`}
                        />
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}
