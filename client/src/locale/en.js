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
        started: "The container has been started",
        stopped: "The container has been stopped",
        killed: "The container has been killed",
        restarted: "The container has been restarted",
        paused: "The container has been paused",
        resumes: "The container has been resumed",
        removed: "The container has been removed",
        renamed: "The container has been renamed"
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
        created: "The user has been created",
        updated: "The user has been updated"
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
        containers: "Containers in network",
        disconnected: "Network was disconnected",
        connected: "Network was connected"
    },
    // menu
    menu: {
        home: 'Home',
        dashboard: 'Dashboard',
        endpoints: "Endpoints",
        settings: 'Settings',
        settings_auth: "Authentication settings",
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
        exec: "Console",
        attach: "Attach the Screen",
        images: "Images",
        networks: "Networks",
        networksList: "Networks List",
        networksEdit: "Networks Edit",
        dockerDashboard: "Docker Dashboard",
        containersList: "Containers List"
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
