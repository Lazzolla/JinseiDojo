import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CarouselBoard from './Board/CarouselBoard'
import BlogBoard from './Board/BlogBoard'
import './board.css'
import '../index.css'

export default function Board() {

    return (
        <div className="board-bg-gral">
            <div className="board-container">
                <div className="board-carouselCol">
                    <CarouselBoard />
                </div>
                <div className="board-blogCol container-fluid">
                    <BlogBoard />
                </div>
                </div>
        </div>
    )
}
