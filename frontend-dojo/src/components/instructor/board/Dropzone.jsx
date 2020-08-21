import React, { Fragment } from "react"
import { useDropzone } from "react-dropzone"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages} from '@fortawesome/free-solid-svg-icons'
import './boardStyling.css'

const Dropzone = ({ onDrop, accept}) => {
  // Initializing useDropzone hooks with options
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: 500000000,
    multiple: true,
  });
  /* 
  useDropzone hooks exposes two functions called getRootProps and getInputProps
  and also exposes isDragActive boolean
  */
  return (
      <Fragment>
    <div 
    className="dropzone-gral" 
    id="dropzone-board" {...getRootProps()}>
      <input
       className="dropzone-input" {...getInputProps()} 
       />
      <div 
      className="dropzone-one text-center"
      >
        {isDragActive ? (
          <FontAwesomeIcon 
          className="dropzone-content-drop"  
          icon={faImages}
           size='lg' 
           />
        ) : (
          <FontAwesomeIcon
           className="dropzone-content"  
           icon={faImages} 
           size='lg'
            />
        )}
      </div>
      <div
       className="dropzone-two text-center">
        {isDragActive ? (
          <FontAwesomeIcon
           className="dropzone-content-drop"  
           icon={faImages}
            size='lg' 
            />
        ) : (
          <FontAwesomeIcon 
          className="dropzone-content" 
           icon={faImages} 
           size='lg' 
           />
        )}
      </div>
      <div className="dropzone-three text-center">
        {isDragActive ? (
          <FontAwesomeIcon
           className="dropzone-content-drop" 
            icon={faImages}
             size='lg' 
             />
        ) : (
          <FontAwesomeIcon
           className="dropzone-content"
             icon={faImages}
              size='lg' 
              />
        )}
      </div>
      <div className="dropzone-four text-center"
      >
        {isDragActive ? (
          <FontAwesomeIcon 
          className="dropzone-content-drop" 
           icon={faImages} 
           size='lg'
            />
        ) : (
          <FontAwesomeIcon 
          className="dropzone-content"
            icon={faImages}
             size='lg' 
             />
        )}
      </div>
      <div 
      className="dropzone-five text-center"
      >
        {isDragActive ? (
          <FontAwesomeIcon 
          className="dropzone-content-drop" 
           icon={faImages}
            size='lg'
             />
        ) : (
          <FontAwesomeIcon 
          className="dropzone-content"  
          icon={faImages}
           size='lg' 
           />
        )}
      </div>
    </div>
    </Fragment>
  )
}
export default Dropzone;