export function getEndpointType(type, icon = false) {
    const endpoint = {
        name: "",
        icon: ""
    }
    switch (type){
        case 1:
            endpoint.name = "Docker"
            break;
        case 2:
            endpoint.name = "Docker (Local)"
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