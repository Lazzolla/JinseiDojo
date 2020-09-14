import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import './instructorVideos.css'

export default function ExamTechniques(props) {
    return (
        <Fragment>
            {props.links
                ? <tbody className="instructorVideos-tbody">
                    {props.links.map((link, key) => (
                        <tr key={key}>
                            <td className="instructorVideos-removeIcon text-center">
                                <div
                                    className="instructorVideos-iconRemoveDiv"
                                    type="button"
                                    onClick={() => props.removeVideo(key)}
                                >
                                    <FontAwesomeIcon
                                        className="instructorVideos-iconRemove"
                                        icon={faTimes} size='lg'
                                    />
                                </div>
                            </td>
                            <td className="instructorVideos-titleCol">
                                <Form.Control
                                    required
                                    id="instructorVideosInputTitle"
                                    name="title"
                                    onChange={e => props.handleUpdates(e, key)}
                                    className="instructorVideos-titleForm"
                                    maxLength={38}
                                    plaintext={true}
                                    placeholder={link.title}
                                />
                            </td>
                            <td className="instructorVideos-urlCol">
                                <Form.Control
                                    required
                                    id="instructorVideosInputUrl"
                                    name="url"
                                    onChange={e => props.handleUpdates(e, key)}
                                    plaintext={true}
                                    placeholder={link.url}
                                />
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={3}>
                            <div
                                type="button"
                                onClick={() => props.addNewVideo()}
                            >
                                <FontAwesomeIcon
                                    className="videoTable-iconPlus"
                                    icon={faPlus}
                                    size='lg'
                                />
                                <h3 className="videoTable-textPlus">
                                    Agregar otro video
                                </h3>
                            </div>
                        </td>
                    </tr>
                </tbody>
                : null
            }
        </Fragment>
    )
}
