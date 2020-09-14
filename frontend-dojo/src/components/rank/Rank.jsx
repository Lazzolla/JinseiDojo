import React, { useState, useRef, useContext, useEffect } from 'react'

import { GralContext } from '../../App'
import { getIndex, getRanks } from '../../Helpers/DataConvertions'
import ButtonDinamic from '../ButtonDinamic'
import BeltsCarousel from "./BeltsCarousel"
import CarouselVideos from './videos/CarouselVideos'
import Exam from './exam/Exam'
import Glossary from './glossary/Glossary'
import './rank.css'

export default function Rank() {
    const context = useContext(GralContext)
    const buttonVideoRef = useRef(null)
    const buttonExamRef = useRef(null)
    const buttonGlossaryRef = useRef(null)

    const [activeBelt, setActiveBelt] = useState(null)
    const [videosBelt, setVideosBelt] = useState(null)
    const [userRank, setUserRank] = useState(null)
    const [ranks, setRanks] = useState([])
    const [videoTab, setVideoTab] = useState('inline')
    const [examTab, setExamTab] = useState("none")
    const [glossaryTab, setGlossaryTab] = useState('none')

    useEffect(() => {
        if (context.state.user.rank) {
            const index = getIndex(context.state.user.rank)
            setUserRank(index)
            const ranks = getRanks(context.state.user.rank)
            setRanks(ranks)
            setActiveBelt(index)
            setVideosBelt(index)
        }
    }, [context])

    const changeActiveTab = (event) => {
        const { id } = event.target
        if (id === 'videos') {
            setActiveBelt(videosBelt)
            setVideoTab('inline')
            setExamTab('none')
            setGlossaryTab('none')

            buttonExamRef.current.persistClickOff()
            buttonGlossaryRef.current.persistClickOff()
            buttonVideoRef.current.persistClickOn()
        }
        if (id === 'exam') {
            setActiveBelt(userRank)
            setExamTab('inline')
            setVideoTab('none')
            setGlossaryTab('none')

            buttonVideoRef.current.persistClickOff()
            buttonGlossaryRef.current.persistClickOff()
            buttonExamRef.current.persistClickOn()
        }
        if (id === 'glossary') {
            setGlossaryTab('inline')
            setVideoTab('none')
            setExamTab('none')

            buttonVideoRef.current.persistClickOff()
            buttonExamRef.current.persistClickOff()
            buttonGlossaryRef.current.persistClickOn()
        }
    }

    const returnIndex = (index) => {
        setActiveBelt(index)
        setVideosBelt(index)
    }

    return (
        <div className="rank">
            <div className="rank-belts">
                <BeltsCarousel
                    activeBelt={activeBelt}
                />
            </div>
            <div className="rank-button-tab-videos  text-center">
                <ButtonDinamic
                    persistClickDefault={true}
                    id="videos"
                    onClick={(event) => changeActiveTab(event)}
                    buttonText="Videos"
                    ref={buttonVideoRef}
                />
            </div>
            <div className="rank-button-tab-exam  text-center">
                <ButtonDinamic
                    id="exam"
                    onClick={(event) => changeActiveTab(event)}
                    buttonText="Examen"
                    ref={buttonExamRef}
                />
            </div>
            <div className="rank-button-tab-glosary text-center">
                <ButtonDinamic
                    id="glossary"
                    onClick={(event) => changeActiveTab(event)}
                    buttonText="Glosario"
                    ref={buttonGlossaryRef}
                />
            </div>
            <div
                className="rank-tab-videos"
                style={{ display: videoTab }}
            >
                <CarouselVideos
                    userRank={userRank}
                    ranks={ranks}
                    returnIndex={returnIndex}
                />
            </div>
            <div
                className="rank-tab-exam"
                style={{ display: examTab }}
            >
                <Exam />
            </div>
            <div
                className="rank-tab-glossary"
                style={{ display: glossaryTab }}
            >
                <Glossary />
            </div>
        </div>
    )
}
