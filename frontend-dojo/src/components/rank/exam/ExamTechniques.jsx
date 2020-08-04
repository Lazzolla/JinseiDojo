import React, { Fragment } from 'react'

export default function ExamTechniques(props) {
    return (
        <Fragment>
            {props.techniques
                ? <tbody>
                    {props.techniques.map((tec, key) => (
                        <tr
                            key={key}
                        >
                            <td>
                                {tec.attack}
                            </td>
                            <td>
                                {tec.technique}
                            </td>
                        </tr>
                    ))}
                </tbody>
                : null}
        </Fragment>
    )
}
