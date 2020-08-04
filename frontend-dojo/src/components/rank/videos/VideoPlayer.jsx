import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import './videoPlayer.css'

export default function VideoPlayer(props) {
    const [links, setLinks] = useState(null)

    useEffect(() => {
        if (props.videosURL) {
            setLinks(props.videosURL)
        }
    }, [props])

    return (
        <tbody>
        <tr>
            {links
                ?
                links.map((videoURL, key) => (
                    <td 
                    key={key}
                    >
                        <div
                         className="backgroundVideo-videoTitleDiv"
                         >
                            <h5 
                            className="backgroundVideo-videoTitle"
                            >
                                {videoURL.title}
                            </h5>
                            </div>
                        <ReactPlayer
                            className='react-player'
                            url={videoURL.url}
                            width='400px'
                            height='225px'
                            controls={true}
                            light={true}
                        />
                    </td>
                ))
                : null}
        </tr>
                </tbody>
    )
}
