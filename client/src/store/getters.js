const getters = {
    currentEndpoint: state => state.app.endpoint,
    endpoint: state => state.app.endpoint,
    loaded: state => state.app.loaded,
    user: state => state.user.user,
    settings: state => state.app.settings
}
export default getters
