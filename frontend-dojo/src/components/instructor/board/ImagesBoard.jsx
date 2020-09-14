import React, { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import './boardStyling.css'

const type = "Image"

// Rendering individual images
const Image = ({ image, index, moveImage, removeItem }) => {
  const ref = useRef(null)

  const [, drop] = useDrop({
    // Accept will make sure only these element type can be droppable on this element
    accept: type,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      // current element where the dragged element is hovered on
      const hoverIndex = index;
      // If the dragged element is hovered in the same place, then do nothing
      if (dragIndex === hoverIndex) {
        return;
      }
      // If it is dragged around other elements, then move the image and set the state with position changes
      moveImage(dragIndex, hoverIndex);
      /*
        Update the index for dragged item directly to avoid flickering
        when the image was half dragged into the next
      */
      item.index = hoverIndex;
    }
  })

  const [{ isDragging }, drag] = useDrag({
    // item denotes the element type, unique identifier (id) and the index (position)
    item: { type, id: image.id, index },
    // collect method is like an event listener, it monitors whether the element is dragged and expose that information
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      className="file-item">
      <img alt={`img - ${image.id}`} src={image.src} className="file-img" />
      <div type="button" onClick={() => removeItem(image.id)} className="dropzone-content-drop_trash">
    <FontAwesomeIcon className="dropzone-trash"  icon={faTrashAlt} size='lg' />
    </div>
    </div>
      
  );
};

// ImageList Component
const ImagesBoard = ({ images, moveImage, removeItem }) => {

  // render each image by calling Image component
  const renderImage = (image, index) => {
    return (
        <Image
        image={image}
        index={index}
        key={`${image.id}-image`}
        moveImage={moveImage}
        removeItem={removeItem}
        />
    )
  }

  // Return the list of files
  return <section className="file-list">
    {images.map(renderImage)}
    </section>;
};

export default ImagesBoard;