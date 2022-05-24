import HttpException from './HttpException';

class NotAuthorizedException extends HttpException {
  constructor(message = "You're not authorized") {
    super(401, message);
  }
}

export default NotAuthorizedException;
