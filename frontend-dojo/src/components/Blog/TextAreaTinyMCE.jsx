import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './publications.css'
class TextAreaTinyMCE extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      body: null
    }

    this.sendContent = this.sendContent.bind(this)
  }

  handleEditorChange = (content, editor) => {
    this.setState({
      body: { content }
    })
  }

  sendContent() {
    if (this.state.body !== null) {
      return this.state.body.content
    } else {
      return null
    }
  }

  render() {
    return (
      <Editor
        apiKey="jrxdt97t22rzt17j2bvieq3x0hqun4yl0em2blvh9dkwr4te"
        init={{
          invalid_elements : "script",
          content_css: 'publications.css',
          height: (window.matchMedia("(max-width: 1370px)")).matches ? "400px" : "500px",
          placeholder: 'Escribe tu publicacion aca...',
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: [
            {
              name: 'formatting', items: ['bold', 'italic', 'forecolor', 'backcolor']
            },
            {
              name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify']
            },
            {
              name: 'indentation', items: ['outdent', 'indent', 'bullist', 'numlist']
            },
            {
              name: 'resetStyles', items: ['removeformat']
            }
          ],
          menubar: false,
          entity_encoding: "raw"
        }
        }
        onEditorChange={this.handleEditorChange}
      />
    )
  }
}

export default TextAreaTinyMCE;
