class Auth {

    isAuthenticated() {
        if (JSON.parse(window.localStorage.getItem('user')) !== null) {
            if (JSON.parse(window.localStorage.getItem('user')).isAuthenticated === true) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    isValidated() {
        if (JSON.parse(window.localStorage.getItem('user')) !== null) {
            if (JSON.parse(window.localStorage.getItem('user')).dataValidation === true) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    isInstructor() {
        if (JSON.parse(window.localStorage.getItem('user')) !== null) {
            if (JSON.parse(window.localStorage.getItem('user')).isInstructor === true) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

}
export default new Auth()