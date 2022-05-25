import HttpException from './HttpException';

class ForbiddenException extends HttpException {
  constructor(message = "You don't have access to see this page.") {
    super(403, message);
  }
}

export default ForbiddenException;
