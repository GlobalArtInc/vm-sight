import HttpException from './HttpException';

class BadRequestException extends HttpException {
    constructor(message = "Bad Request") {
        super(400, message);
    }
}

export default BadRequestException;
