import React, { useEffect, useRef, useState, useContext } from 'react'
import ReactDOM from 'react-dom'
import InputEmoji from "react-input-emoji";
import 'emoji-mart/css/emoji-mart.css'
import {GralContext} from '../App'

import './input.css'

export default function Input(props) {
const context = useContext(GralContext)
    const inputRef = useRef(null)
    const [message, setMessage] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [id, setId] = useState(null)


useEffect(() => {
setIsAuthenticated(context.user.isAuthenticated)
}, [context.user.isAuthenticated])


   useEffect(() => {
       if(props.id) {
           setId(props.id)
        }
   }, [props.id])

   useEffect(() => {
       if(id !== null) {
        inputRef.current.focus()
       }
   }, [id])

    const newMessageText = (newMessage) => {
        if(isAuthenticated) {
            if(props.sendTyping !== null) {
        props.sendTyping()
        setMessage(newMessage)
            }
        }
    }

    const sendMessage = (message) => {
        
        if(isAuthenticated) {
        props.onKeyPressInput(message)
        }
    }

    return (
        <InputEmoji
            id={id}
            ref={inputRef}
      value={message}
      onChange={newMessageText}
      cleanOnEnter
      onEnter={sendMessage}
      placeholder={props.placeholderInput}
      borderRadius={15}
    />
    )
}
