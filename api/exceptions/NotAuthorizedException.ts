import HttpException from './HttpException';

class NotAuthorizedException extends HttpException {
    constructor() {
        super(401, "You're not authorized");
    }
}

export default NotAuthorizedException;