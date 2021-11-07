import {ILogObject, Logger} from 'tslog';
import {appendFileSync, existsSync, mkdirSync} from 'fs';
import {dataDir} from "../constants";

function getLogLevel(level: string) {
    let color = '9';

    switch (level) {
        case 'error':
            color = '1';
            break;
        case 'debug':
            color = '2';
            break;
        case 'warn':
            color = '6';
            break;
        case 'data':
            color = '8';
            break;
        case 'info':
            color = '4';
            break;
        case 'verbose':
            color = '3';
            break;
        case 'silly':
            color = '3';
            break;

    }
    return `[3${color}m${level.toUpperCase()}[39m`;
}

function parseLogs(logObject: ILogObject) {
    return `${logObject.date}  ${getLogLevel(logObject.logLevel)}  ${logObject.argumentsArray.join(' ')}`;
}

function logToDebugFile(logObject: ILogObject) {
    appendFileSync(dataDir + '/debug.log', parseLogs(logObject) + '\n');
}

function logToErrorFile(logObject: ILogObject) {
    appendFileSync(dataDir + '/error.log', parseLogs(logObject) + '\n');
}

function logToFile(logObject: ILogObject) {
    appendFileSync(dataDir + '/app.log', parseLogs(logObject) + '\n');
}

if (!existsSync(dataDir)) {
    mkdirSync(dataDir);
}

const logger: Logger = new Logger({
    displayFilePath: "hidden",
    displayFunctionName: false,
    displayLoggerName: false
});

logger.attachTransport(
    {
        silly: logToFile,
        debug: logToDebugFile,
        trace: logToFile,
        info: logToFile,
        warn: logToFile,
        error: logToErrorFile,
        fatal: logToFile,
    },
    'debug'
);

export default logger;
