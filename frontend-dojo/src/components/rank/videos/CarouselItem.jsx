import React, { useEffect, useState } from 'react'
import { SeparateArrayInGroups } from '../../../Helpers/DataConvertions'
import Carousel from 'react-bootstrap/Carousel'
import VideoPlayer from './VideoPlayer'
import './carouselItem.css'

export default function CarouselItem(props) {
    const [links, setLinks] = useState(null)

    useEffect(() => {
        // MERGE GRUPS OF 3 LINKS
        if (props.videosURL) {
            const groupItems = SeparateArrayInGroups(props.videosURL, 3)
            setLinks(groupItems)
        }
    }, [props])

    return (
        <Carousel
            className="carouselItem-carousel"
            indicators={true}
            interval={null}
            wrap={false}
            keyboard={false}
            nextIcon={
                <span
                    aria-hidden="true"
                    className="carouseItem-horizontal-nextIcon carousel-control-next-icon"
                />
            }
            prevIcon={
                <span
                    aria-hidden="true"
                    className="carouseItem-horizontal-prevIcon carousel-control-prev-icon"
                />
            }
        >
            {links
                ?
                links.map((videosURL, key) => (
                    <Carousel.Item
                        className="carouselItem-item"
                        key={key}>
                        <table>
                            <VideoPlayer
                                videosURL={videosURL}
                            />
                        </table>
                    </Carousel.Item>
                ))
                : null
            }
        </Carousel>
    )

}
