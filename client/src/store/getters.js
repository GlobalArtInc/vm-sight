const getters = {
    currentEndpoint: state => state.app.endpoint,
    loaded: state => state.app.loaded,
    user: state => state.user.user
}
export default getters
