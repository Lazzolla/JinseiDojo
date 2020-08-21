import React, { Component, Fragment, createContext } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import Card from 'react-bootstrap/Card'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import Board from './components/Board'
import Profile from './components/profile/Profile'
import Rank from './components/rank/Rank'
import Publications from './components/Blog/Publications'
import Instructor from './components/instructor/Instructor'
import Blog from './components/Blog/Blog'
import Lobby from './components/Chat/Lobby'
import ModalAlert from './components/ModalAlert'
import ButtonDinamic from './components/ButtonDinamic'
import { ProtectedRoute, ProtectedInstructor, ProtectedProfile } from './components/ProtectecRoute'
import './index.css'

export let socket

export const GralContext = createContext([])
export default class App extends Component {

  constructor(props) {
    super(props)

    this.main = this.main.bind(this)
    this.refreshState = this.refreshState.bind(this)

    this.state = {
      gralMessages: [],
      instMessages: [],
      user: {}
    }
  }



  modalWarningRef = React.createRef()
  buttonRefSubmit = React.createRef()

  async UNSAFE_componentWillMount() {

    socket = io('jinseidojo.com', { secure: true, rejectUnauthorized: true })
    socket.emit('online')
    this.main()
  }

  main() {
    if (window.localStorage.getItem('user')) {
      // This is in case cookie expired and need it to re logIn
      if(socket.connected === false) {
        socket = io('jinseidojo.com', { secure: true, rejectUnauthorized: true })
      }
      socket.on('updateValidation', async () => {
        const { data } = await axios.get('api/users/getuser', { withCredentials: true })
        this.modalWarningRef.current.show()
        window.localStorage.setItem('user', JSON.stringify(data))
        this.setState({
          user: JSON.parse(window.localStorage.getItem('user'))
        })
      })

      socket.on('updatedUser', () => {
        this.setState({
          user: JSON.parse(window.localStorage.getItem('user'))
        })
      })
      const { nickname, profilePictureLocation, _id } = JSON.parse(window.localStorage.getItem('user'))
      socket.emit('online', { nickname, profilePictureLocation, _id })
      this.setState({
        user: JSON.parse(window.localStorage.getItem('user'))
      })
    }
  }

  refreshState() {
    this.setState({
      gralMessages: [],
      instMessages: [],
      user: {}
    })
  }

  render() {
    return (

      <Fragment >
        <Router>
          <Fragment>
            <GralContext.Provider
              value={{
                  state: this.state,
                  refreshState: this.refreshState
                }}
            >
              <Route path="/"
                render={(props) => <Navigation {...props}
                  user={this.state.user}
                  main={this.main}
                  refreshState={this.refreshState}
                />}
              />
              <Route
                exact
                path="/"
                component={Board}
              />
              <Route
                path="/"
                component={Lobby}
              />
              <ProtectedProfile
                exact
                path="/profile"
                component={Profile}
              />
              <ProtectedRoute
                exact
                path="/rank"
                component={Rank}
              />
              <ProtectedInstructor
                exact
                path="/instructor"
                component={Instructor}
              />
              <ProtectedRoute
                exact
                path="/publications"
                component={Publications}
              />
              <ProtectedRoute
                exact
                path="/blog"
                component={Blog}
              />
            </GralContext.Provider>
          </Fragment>
        </Router>
        {/* MODAL VALIDATION COMPLETE */}
        <ModalAlert
          dialogClassName="custom-dialog"
          backdrop={true}
          size="lg"
          title="Tu instructor validó tus datos!"
          ref={this.modalWarningRef}
        >
          <Card.Text
            className="text-center h5"
          >
            Ya podes usar todo el contenido de la página.
        </Card.Text>
          <ButtonDinamic
            buttonText="Bienvenido!"
            customStyle="app-modalButton"
            name=""
            type="submit"
            size="btn-md"
            spinnerSize="md"
            color="btn-danger"
            onClick={() => this.modalWarningRef.current.close()}
            ref={this.buttonRefSubmit}
          />
        </ModalAlert>
      </Fragment>
    )
  }
}
