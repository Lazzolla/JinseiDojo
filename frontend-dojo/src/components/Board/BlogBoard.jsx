import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { GralContext, socket } from '../../App'
import PubBoard from './PubBoard/PubBoard'
import './blogBoard.css'

export default function BlogBoard() {
  const context = useContext(GralContext)
  const [latestPub, setLatestPub] = useState([])    
  useEffect(() => {
          socket.on('latestPubUpdated', async () => {
              try {
                const { data } = await axios.get('api/blog/latestpub', { withCredentials:    true })
                setLatestPub(data)
              } catch (err) {
                console.log(err.response)
              }
          })
  }, [])    
  return (
          <div className="blogBoard-container">
              <p
                className="blogBoard-title"
                align="center"
              >
                Últimas publicaciones
              </p>
                 <div className="blogBoard-latestPublish">
                      <PubBoard
                         latestPub={latestPub}
                         isAuthenticated={context.state.user.isAuthenticated}
                      />
                  </div>
          </div>
  )

}
