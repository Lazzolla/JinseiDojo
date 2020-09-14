import React, { useState, useEffect, useRef } from 'react'
import Slider from "react-slick"

import './beltsCarousel.css'

export default function BeltsCarousel(props) {
    const sliderTitleRef = useRef(null)

    const [belts] = useState([
        'white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black1', 'black2', 'black3'
    ])

    useEffect(() => {
        sliderTitleRef.current.slickGoTo(props.activeBelt)
    }, [props.activeBelt])

    var settings = {
        className: "center",

        dots: false,
        infinite: false,
        speed: 500,
        slide: 'div',
        slidesToShow: 1,
        slidesToScroll: 1,
        slideHeight: 0,
        draggable: false,
        arrows: false,
        adaptiveHeight: true,
        vertical: true,
        fade: true,
    }

    return (
        belts
            ?
            <Slider
                ref={sliderTitleRef}
                {...settings}
            >
                {belts.map((belt, key) => (
                    <div
                        key={key}
                        className="beltsCarousel-image"
                    >
                        <img
                            src={require(`../../pictures/rank/belts/${belt}.png`)}
                            alt={'belt'}
                        />
                    </div>
                ))}
            </Slider>
            : null
    )
}
