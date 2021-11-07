import HttpException from './HttpException';

class ForbiddenException extends HttpException {
    constructor() {
        super(403, "You don't have access to see this page.");
    }
}

export default ForbiddenException;