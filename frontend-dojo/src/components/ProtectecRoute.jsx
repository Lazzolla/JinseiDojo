import React, {useContext} from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from '../Helpers/auth'
import {GralContext} from '../App'

export const ProtectedRoute = ({ component: Component, ...rest }) => {
        const context = useContext(GralContext)
    return (
        <Route {...rest} render={
            (props) => {
                if (auth.isAuthenticated() && auth.isValidated()) {
                    return <Component
                    context={context}
                    {...props} />
                } else {
                    return <Redirect to={{
                        pathname: "/",
                        state: {
                            from: props.location
                        }
                    }}
                    />
                }
            }
        } />
    )
}

export const ProtectedProfile = ({ component: Component, ...rest }) => {
    const context = useContext(GralContext)
return (
    <Route {...rest} render={
        (props) => {
            if (auth.isAuthenticated()) {
                return <Component
                context={context}
                {...props} />
            } else {
                return <Redirect to={{
                    pathname: "/",
                    state: {
                        from: props.location
                    }
                }}
                />
            }
        }
    } />
)
}

export const ProtectedInstructor = ({ component: Component, ...rest }) => {
    const context = useContext(GralContext)
return (
    <Route {...rest} render={
        (props) => {
            if (auth.isAuthenticated() && auth.isValidated() && auth.isInstructor()) {
                return <Component
                context={context}
                {...props} />
            } else {
                return <Redirect to={{
                    pathname: "/",
                    state: {
                        from: props.location
                    }
                }}
                />
            }
        }
    } />
)
}