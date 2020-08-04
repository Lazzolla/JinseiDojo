import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import update from 'immutability-helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { uuid } from 'uuidv4'
import { Base64ToArrayBuffer, BufferToBase64 } from '../../../Helpers/blobsAnd64'
import ImagesBoard from './ImagesBoard'
import ButtonDinamic from '../../ButtonDinamic'
import ModalAlert from '../../ModalAlert'
import Dropzone from './Dropzone'
import { socket } from '../../../App'
import './boardStyling.css'

export default function BoardMixing() {
    const ButtonSaveBoardRef = useRef(null)
    const buttonRefCancel = useRef(null)
    const buttonRefSave = useRef(null)
    const modalWarningRef = useRef(null)

    const [images, setImages] = useState([])
    const [refresh, setRefresh] = useState([])
    const [errorDisplay, setErrorDisplay] = useState('')

    useEffect(() => {
        async function getBoard() {
            const {data} = await axios.get('api/board/getboard64',
            { withCredentials: true })
        const imgs64 = data.boardImages.map((el, key) => {
            const src = `data:image/${data.extensions[key]};base64,` + BufferToBase64(el.Body.data)
            const img = {id: uuid(), src}
            return img
            
        })
        setImages(imgs64)
        setRefresh(imgs64)
        }
        getBoard()
    }, [])

    const saveBoardImages = async () => {
        buttonRefCancel.current.disabled()
        buttonRefSave.current.loading()
        buttonRefSave.current.disabled()
        let boardImages = new FormData()
        for (let x = 0; x < images.length; x++) {
            const type = images[x].src.match(/([a-zA-Z]*);/g)
            if(type) {
            const imgType = type[0].slice(0, -1)
            boardImages.append('boardImages', Base64ToArrayBuffer(images[x].src), x + "." + imgType)
            }
        }
        try {
            await axios.post('api/board/upload',
                boardImages,
                { withCredentials: true })
            buttonRefSave.current.success()
            modalWarningRef.current.victoryClose()
            socket.emit('updatedBoard', 'updatedBoard')
        } catch (err) {
            setTimeout(() => {
                setErrorDisplay('')
            }, 5000)
            setErrorDisplay('No se pudo Guardar la cartelera actual, por favor intenta de nuevo.')
            buttonRefCancel.current.reset()
            buttonRefSave.current.reset()
        }
    }

    const moveImage = (dragIndex, hoverIndex) => {
        // Get the dragged element
        const draggedImage = images[dragIndex];
        /*
          - copy the dragged image before hovered element (i.e., [hoverIndex, 0, draggedImage])
          - remove the previous reference of dragged element (i.e., [dragIndex, 1])
          - here we are using this update helper method from immutability-helper package
        */
        setImages(
            update(images, {
                $splice: [[dragIndex, 1], [hoverIndex, 0, draggedImage]]
            })
        );
    };

    const onDrop = (acceptedFiles,fileRejections) => {
        if (fileRejections.length > 0) {
            setTimeout(() => {
                setErrorDisplay('')
            }, 5000)
            return setErrorDisplay('la imagen es muy pesada, el max es 5 Mb.')
        }
        if ((acceptedFiles.length + images.length) > 5) {
            setTimeout(() => {
                setErrorDisplay('')
            }, 5000)
            return setErrorDisplay('El maximo son 5 imagenes.')
        } else {
            // Loop through accepted files
            acceptedFiles.map(file => {
                // Initialize FileReader browser API
                const reader = new FileReader();
                // onload callback gets called after the reader reads the file data
                reader.onload = function (e) {
                    // add the image into the state. Since FileReader reading process is asynchronous, its better to get the latest snapshot state (i.e., prevState) and update it. 
                    setImages(prevState => [
                        ...prevState,
                        { id: uuid(), src: e.target.result }
                    ]);
                };
                // Read the file as Data URL (since we accept only images)
                reader.readAsDataURL(file);
                return file;
            })
        }
    }

    // REMOVE ITEM FROM LIST
    const removeItem = (id) => {
        setImages(images.filter(el => el.id !== id))
    }

    // We pass onDrop function and accept prop to the component. It will be used as initial params for useDropzone hook
    return (
        <main 
        className="boardMixing-gral"
        >
            <h3
             className="boardMixing-text"
             >
                 Los cambios que guardes no pueden deshacerse. Al momento de guardar esta seguro que la cartelera se ve como deberia. El orden de los elementos refleja el orden en que se veran. Podes volver a empezar haciendo click en el boton de refrescar
                 </h3>
            <h2
             className="boardMixing-warningText"
             >
                 {errorDisplay}
                 </h2>
                  <div
                   type="button" 
                   onClick={() => setImages(refresh)} className="boardMixing-refreshContainer"
                   >
    <FontAwesomeIcon 
    className="boardMixing-refreshIcon" 
     icon={faRedo}
      size='lg'
       />
    </div>
            <DndProvider 
            backend={HTML5Backend}
            >
                <Dropzone
                    onDrop={onDrop}
                    accept={"image/*"}
                />
                <ImagesBoard
                 images={images} 
                 moveImage={moveImage} 
                 removeItem={removeItem}
                  />
            </DndProvider>
            <div
                className="board-button-save"
            >
                <ButtonDinamic
                    buttonText="Guardar cartelera"
                    successText="Cartelera guardada"
                    onClick={() => modalWarningRef.current.show()}
                    ref={ButtonSaveBoardRef}
                />
            </div>
            {/* MODAL SAVE BOARD */}
            <ModalAlert
                dialogClassName="custom-dialog"
                backdrop={true}
                size="lg"
                title="¿Estas seguro que queres guardar la cartelera?"
                ref={modalWarningRef}
            >
                <Card.Text 
                className="text-center h5"
                >
                    Cualquier cambio que hayas hecho no podra recuperarse.
                    </Card.Text>
                <Row>
                    <Col>
                        <ButtonDinamic
                            customStyle=" mt-3 "
                            buttonText="Mejor no"
                            onClick={() => modalWarningRef.current.close()}
                            ref={buttonRefCancel}
                        />
                    </Col>
                    <Col>
                        <ButtonDinamic
                            customStyle=" mt-3 "
                            successText="Cartelera guardada"
                            buttonText="Guardar"
                            onClick={() => saveBoardImages()}
                            ref={buttonRefSave}
                        />
                    </Col>
                </Row>
            </ModalAlert>
        </main>
    );
}

