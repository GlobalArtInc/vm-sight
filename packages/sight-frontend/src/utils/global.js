export function getEndpointSearchType(type) {
    switch (type) {
        case 'docker':
            return 1;
    }
}

export function getGets() {
    var a = window.location.search;
    var b = new Object();
    a = a.substring(1).split("&");
    for (var i = 0; i < a.length; i++) {
        let c = a[i].split("=");
        b[c[0]] = c[1];
    }
    return b;
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
    switch (type) {
        case 1:
            endpoint.id = 1
            endpoint.name = "Docker"
            break;
        case 2:
            endpoint.id = 2
            endpoint.name = "Docker (via Socket)"
    }
    if (icon) {
        switch (type) {
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
