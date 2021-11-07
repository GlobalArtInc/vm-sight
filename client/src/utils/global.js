export function getEndpointSearchType(type) {
    switch (type) {
        case 'docker':
            return 1;
    }
}

export function parseSettings(settings) {
    settings = settings.replace('true', true).replace('false', false)
    return settings
}

export function getEndpointType(type, icon = false) {
    const endpoint = {
        name: "",
        icon: ""
    }
    switch (type){
        case 1:
            endpoint.id = 1
            endpoint.name = "Docker"
            break;
        case 2:
            endpoint.id = 2
            endpoint.name = "Docker (via Socket)"
    }
    if (icon) {
        switch (type){
            case 1:
                endpoint.icon = 'fab fa-docker'
                break;
            case 2:
                endpoint.icon = 'fab fa-docker'
                break;
        }
    }
    return endpoint;
}

export function removePort(url) {
    return url.split(":")[0]
}
