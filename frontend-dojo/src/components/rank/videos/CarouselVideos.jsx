import React, { useRef, useState, useEffect, Fragment } from "react"
import axios from 'axios'
import Slider from "react-slick"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import CarouselItem from './CarouselItem'
import ButtonDinamic from "../../ButtonDinamic"
import './carouselVideos.css'

export default function CarouselVideos(props) {

  const sliderRef = useRef(null)
  const sliderTitleRef = useRef(null)

  const [ranks, setRanks] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [links, setLinks] = useState([])
  const [errorDisplay, setErrorDisplay] = useState('')

  useEffect(() => {
    if (props.userRank) {
      setUserRank(props.userRank)
      setRanks(props.ranks)
    }
  }, [props])

  useEffect(() => {
    async function getVideos() {
      try {
        const { data } = await axios.get('api/instructor/getuservideolist', { withCredentials: true })
        let userVideos = []
        for (let x = 0; x <= userRank; x++) {
          userVideos.push(data[x])
        }
        setLinks(userVideos)
        userVideos = []
      } catch (err) {
        setErrorDisplay(err.response.data.message)
      }
    }
    getVideos()
  }, [userRank])


  const next = () => {
    sliderRef.current.slickNext()
    sliderTitleRef.current.slickNext()
  }

  const previous = () => {
    sliderRef.current.slickPrev()
    sliderTitleRef.current.slickPrev()
  }

  // REACT_SLICK CONFIG
  var settings = {
    className: "center",
    accessibility: false,
    dots: false,
    infinite: false,
    speed: 500,
    slide: 'div',
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    vertical: true,
    verticalSwiping: true,
    arrows: false,
    initialSlide: userRank,
    beforeChange: (current, next) => props.returnIndex(next)
  }
  var settingsTitle = {
    className: "center",
    dots: false,
    infinite: false,
    speed: 500,
    slide: 'div',
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    vertical: true,
    verticalSwiping: true,
    arrows: false,
    initialSlide: userRank,
    adaptiveHeight: true
  }

  return (
    userRank
      ? <Fragment>
        {links.length > 0
          ? <Fragment>
            <div className="videos-row-title">
              <Slider
                ref={sliderTitleRef}
                {...settingsTitle}
              >
                {ranks.map((rank, key) => (
                  <div key={key}>
                    <h3 className="videos-carousel-title">
                      {rank}
                    </h3>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="video-button-up-carousel  text-center">
              <ButtonDinamic
                customStyle="video-button-up-carousel-button"
                onClick={() => previous()}
                stylePrimaryText="video-button-up-carousel-icon"
                buttonText={<FontAwesomeIcon
                  type="button"
                  icon={faCaretUp}
                  size='3x'
                />
                }
              />
            </div>
            <div className="videos-row">
              <Slider
                ref={sliderRef}
                {...settings}
              >
                {links.map((videosURL, key) => (
                  <div key={key}>
                    <CarouselItem
                      videosURL={videosURL}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div
              type="button"
              className="video-button-down-carousel  text-center"
            >
              <ButtonDinamic
                customStyle="video-button-down-carousel-button"
                onClick={() => next()}
                stylePrimaryText="video-button-down-carousel-icon"
                buttonText={
                  <FontAwesomeIcon
                    type="button"
                    icon={faCaretDown}
                    size='3x'
                  />
                }
              />
            </div>
          </Fragment>
          : <h1 className="videos-row-title">
            {errorDisplay}
          </h1>
        }
      </Fragment>
      : null
  )
}
