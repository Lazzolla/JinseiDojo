import React from 'react'
import Form from 'react-bootstrap/Form'

export default function SelectExamTechniques(props) {

    return (
        <Form.Control
            hidden={props.hidden}
            id={props.id}
            plaintext={true}
            className="bg-transparent"
            name={props.name}
            as="select"
            onChange={(event) => props.handleChange(event)}
        >
            <option>Elegí una técnica</option>
            <option value="Ikkyo">Ikkyo</option>
            <option value="Nikyo">Nikyo</option>
            <option value="Sankyo">Sankyo</option>
            <option value="Yonkyo">Yonkyo</option>
            <option value="Gokyo">Gokyo</option>
            <option value="Aiki otoshi">Aiki otoshi</option>
            <option value="Irimi nage">Irimi nage</option>
            <option value="Juji nage">Juji nage</option>
            <option value="Kaiten nage">Kaiten nage</option>
            <option value="Kokyu nage">Kokyu nage</option>
            <option value="Koshi nage">Koshi nage</option>
            <option value="Kote gaeshi">Kote gaeshi</option>
            <option value="Shiho nage">Shiho nage</option>
            <option value="Sumi otoshi">Sumi otoshi</option>
            <option value="Tenchi nage">Tenchi nage</option>
        </Form.Control>
    )
}
