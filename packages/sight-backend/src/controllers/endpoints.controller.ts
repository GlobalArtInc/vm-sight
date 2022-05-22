import EndpointsService from "../services/endpoints.service";
import ForbiddenException from "../exceptions/ForbiddenException";

class EndpointsController {
    public endpointsService = new EndpointsService();

    public getAll = async (req, res) => {
        if (req.user.role === 1)
            return res.status(200).json(await this.endpointsService.getAll());
        else
            throw new ForbiddenException()
    }

}

export default EndpointsController;
