export const wrapRouteHandler = fn => {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Current unix timestamp
 */
export function currentTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

/**
 * Get setting from the sight settings array
 * @param data
 * @param name
 * @param defaultValue
 */
export function getSetting(data, name, defaultValue: any = false) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === name) {
      if (typeof defaultValue === 'boolean') {
        return data[i].value === 'true';
      } else if (typeof defaultValue === 'number') {
        return parseInt(data[i].value);
      } else {
        return data[i].value;
      }
    }
  }
  if (defaultValue) {
    return defaultValue;
  } else if (typeof defaultValue === 'string') {
    return '';
  } else if (typeof defaultValue === 'number') {
    return 0;
  }
  return false;
}

export function isWindows() {
  return process.platform === 'win32';
}
