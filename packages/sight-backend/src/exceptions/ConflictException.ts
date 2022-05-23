import HttpException from "./HttpException";

class ConflictException extends HttpException {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

export default ConflictException;
