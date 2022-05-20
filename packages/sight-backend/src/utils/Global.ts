export function getSetting(data, name, defaultValue: any = false) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].key === name) {
            if (typeof defaultValue === 'boolean') {
                return data[i].value === "true"
            } else if (typeof defaultValue === 'number') {
                return parseInt(data[i].value)
            } else {
                return data[i].value
            }
        }
    }
    if (defaultValue) {
        return defaultValue
    } else if (typeof defaultValue === "string") {
        return ""
    } else if (typeof defaultValue === "number") {
        return 0
    }
    return false
}