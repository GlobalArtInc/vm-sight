/* eslint @typescript-eslint/camelcase: 0 */

// import en from 'vuetify/es5/locale/en'

export default {
  label: 'English',
  // page login
  login: 'Login',
  logout: 'Logout',
  register: 'Register',
  username: 'Username',
  password: 'Password',
  login_account: 'Login account',
  // labels
  labels: {
    language: 'Language'
  },
  //
  create: 'Create',
  update: 'Update',
  cancel: 'Cancel',
  create_endpoint: 'Add Endpoint',
  update_endpoint: 'Update Endpoint',
  // app drawer
  sponsor: 'Sponsor',
  information: 'Information',
  info: 'Info',
  types: {
    agent: 'Agent',
    docker: 'Docker',
    docker_socket: 'Docker via Socket',
    kubernetos: 'Kubernetos'
  },
  docker: {
    swarm_warn: 'VM-SIGHT is connected to a node that is part of a Swarm cluster. Some resources located on other nodes in the cluster might not be available for management.'
  },
  containers: {
    start: 'The container has been started',
    stop: 'The container has been stopped',
    kill: 'The container has been killed',
    restart: 'The container has been restarted',
    pause: 'The container has been paused',
    resume: 'The container has been resumed',
    remove: 'The container has been removed',
    rename: 'The container has been renamed'
  },
  // user page
  yes: 'Yes',
  no: 'No',
  name: 'Name',
  endpoints: {
    edit: 'Edit Endpoint',
    host: 'Endpoint Host',
    public_url: 'Public URL',
    logs: 'Logs',
    inspect: 'Inspect',
    stats: 'Stats',
    console: 'Console',
    attach: 'Attach'
  },
  user: {
    username: 'Username',
    password: 'Password',
    repeatPassword: 'Repeat password',
    administrator: 'Administrator',
    oauth2_identity: 'OAuth2 Identity',
    created: 'The user has been created',
    updated: 'The user has been updated'
  },
  endpointsCreate: 'New Endpoint',
  endpointsEdit: 'Edit Endpoint',
  usersCreate: 'New User',
  usersEdit: 'Edit User',
  endpoint_already_exists: 'Endpoint is already exist',
  errors: {
    field_is_required: 'Field is required'
  },
  networks: {
    details: 'Networks Details',
    options: 'Network Options',
    containers: 'Containers in network',
    disconnected: 'Network was disconnected',
    connected: 'Network was connected',
    removed: 'Network was removed'
  },
  // menu
  menu: {
    home: 'Home',
    dashboard: 'Dashboard',
    endpoint: 'Endpoint',
    endpoints: 'Endpoints',
    settings: 'Settings',
    settings_auth: 'Authentication',
    docker: 'Docker',
    containers: 'Containers',
    edit: 'Edit',
    users: 'Users',
    usersCreate: 'New User',
    usersEdit: 'Edit User',
    endpointsEdit: 'Edit Endpoint',
    endpointsCreate: 'New Endpoint',
    list: 'List',
    registries: 'Registries',
    logs: 'Logs',
    exec: 'Console',
    attach: 'Attach the Screen',
    images: 'Images',
    imageEdit: 'Image Edit',
    networks: 'Networks',
    networksList: 'Networks List',
    networksCreate: 'A new network',
    networksEdit: 'Networks Edit',
    dockerDashboard: 'Docker Dashboard',
    containersList: 'Containers List'
  },
  // media
  media: 'Media',
  // rules
  rule: {
    required: '{0} is required'
  }

  // error

  // ...en
};
