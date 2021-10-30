import {IRequest, IResponse, INext} from "../interfaces/express.interface";
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, request: IRequest, response: IResponse, next: INext) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response
        .status(status)
        .send({
            message,
            status,
        });
}

export default errorMiddleware;