import React, { useState, useRef, useContext} from 'react'

import { GralContext } from '../../App'
import ButtonDinamic from '../ButtonDinamic'
import BoardMixing from './board/BoardMixing'
import InstructorVideos from './InstructorVideos.jsx/InstructorVideos'

import '../rank/rank.css'
import './instructor.css'

export default function Rank() {
    const context = useContext(GralContext)
    const buttonVideosRef = useRef(null)
    const buttonBoardRef = useRef(null)

    const [videosTab, setVideosTab] = useState('inline')
    const [boardTab, setBoardTab] = useState("none")

    const changeActiveTab = (event) => {
        const { id } = event.target
        console.log(id)
        if (id === 'videos') {
            setVideosTab('inline')
            setBoardTab('none')
            if(buttonBoardRef.current !== null) {
            buttonBoardRef.current.persistClickOff()
        }
            buttonVideosRef.current.persistClickOn()
        }
        if (id === 'board') {
            setBoardTab('inline')
            setVideosTab('none')
            if(buttonBoardRef.current !== null) {
                buttonBoardRef.current.persistClickOn()
            }
            buttonVideosRef.current.persistClickOff()
        }
    }
    
    return (
        <div className="inst">
            {context.user.boardManagement
                ? <div
                    className="inst-button-tab-board  text-center"
                    >
                    <ButtonDinamic
                        id="board"
                        onClick={(event) => changeActiveTab(event)}
                        buttonText="Cartelera de novedades"
                        ref={buttonBoardRef}
                    />
                </div>
                : null}
            <div 
            className="inst-button-tab-videos  text-center"
            >
                <ButtonDinamic
                    persistClickDefault={true}
                    id="videos"
                    onClick={(event) => changeActiveTab(event)}
                    buttonText="Mis Videos"
                    ref={buttonVideosRef}

                />
            </div>
            {context.user.boardManagement
                ? <div 
                className="inst-tab-board" 
                style={{ display: boardTab }}
                >
                    <BoardMixing />
                </div>
                : null}
            <div 
            className="inst-tab-videos"
             style={{ display: videosTab }}
             >
                <InstructorVideos />
            </div>
            <div 
            className="inst-button-tab-glosary text-center"
            >
            </div>
        </div>
    )
}
