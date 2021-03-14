import en from 'vuetify/es5/locale/en'

export default {
    label: 'English',
    //page login
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    login_account: 'Login account',
    //
    create: "Create",
    update: "Update",
    cancel: "Cancel",
    create_endpoint: "Add Endpoint",
    update_endpoint: "Update Endpoint",
    //app drawer
    sponsor: 'Sponsor',
    information: 'Information',
    types: {
        agent: "Agent",
        docker: "Docker",
        kubernetos: "Kubernetos"
    },
    containers: {
        started: "Container was started",
        stopped: "Container was stopped",
        killed: "Container was killed",
        restarted: "Container was restarted",
        paused: "Container was paused",
        resumes: "Container was resumed",
        removed: "Container was removed"
    },
    // user page
    yes: "Yes",
    no: "No",
    name: "Name",
    endpoints: {
        edit: "Edit Endpoint",
        url: "Endpoint URL",
        public_url: "Public URL",
        logs: "Logs",
        inspect: "Inspect",
        stats: "Stats",
        console: "Console",
        attach: "Attach"
    },
    user: {
        username: "Username",
        password: "Password",
        repeatPassword: "Repeat password",
        administrator: "Administrator",
        created: "User was created",
        updated: "User was updated"
    },
    endpointsCreate: "New Endpoint",
    endpointsEdit: "Edit Endpoint",
    usersCreate: "New User",
    usersEdit: "Edit User",
    endpoint_already_exists: "Endpoint is already exist",
    errors: {
        field_is_required: "Field is required"
    },
    networks: {
        details: "Networks Details",
        options: "Network Options",
        containers: "Containers in network"
    },
    // menu
    menu: {
        home: 'Home',
        dashboard: 'Dashboard',
        endpoints: "Endpoints",
        settings: 'Settings',
        docker: "Docker",
        containers: "Containers",
        edit: "Edit",
        users: 'Users',
        usersCreate: 'New User',
        usersEdit: 'Edit User',
        endpointsEdit: "Edit Endpoint",
        endpointsCreate: "New Endpoint",
        list: "List",
        registries: "Registries",
        logs: "Logs",
        images: "Images",
        networks: "Networks"
    },
    //media
    media: 'Media',
    // rules
    rule: {
        required: '{0} is required'
    },

    //error

    ...en
}
