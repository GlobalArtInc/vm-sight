export const wrapRouteHandler = fn => {
    return async function (req, res, next) {
        let e = null;
        try {
            await fn(req, res, next);
        } catch (err) {
            e = err;
            next(err);
        }
    };
};

export function currentTimestamp() {
    return Math.floor(new Date().getTime()/1000)
}

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

