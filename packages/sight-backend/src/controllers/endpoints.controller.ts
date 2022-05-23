import EndpointsService from "@services/endpoints.service";
import ForbiddenException from "@exceptions/ForbiddenException";

class EndpointsController {
  public endpointsService = new EndpointsService();

  /**
   * @openapi
   *   /endpoints:
   *     get:
   *       tags:
   *       - endpoints
   *       summary: Fetch all endpoints
   *       responses:
   *         200:
   *           description: 'Ok'
   *         500:
   *           description: 'Server Error'
   */
  public getAll = async (req, res) => {
    if (req.user.role === 1)
      return res.status(200).json(await this.endpointsService.getAll());
    else return res.status(200).json([]);
  };

  /**
   * @openapi
   *   /endpoints:
   *     post:
   *       tags:
   *       - endpoints
   *       summary: Create an endpoint
   *       parameters:
   *       - name: body
   *         in: body
   *         description: CreateEndpointDto
   *         required: true
   *         schema:
   *           $ref: '#/definitions/createEndpointDto'
   *       responses:
   *         200:
   *           description: 'Ok'
   *         400:
   *           description: 'Bad Request'
   *         500:
   *           description: 'Server Error'
   */
  public createEndpoint = async (req, res) => {
    await this.endpointsService.create(req.body);
    return res.status(201).json({ status: 201 });
  };

  /**
   * @openapi
   *   /endpoints/{id}:
   *     delete:
   *       tags:
   *       - endpoints
   *       summary: Delete endpoint by ID
   *       parameters:
   *       - name: id
   *         in: path
   *         description: Endpoint ID
   *         required: true
   *         type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'Endpoint not found'
   *         500:
   *           description: 'Server Error'
   */
  public remove = async (req, res) => {
    if (req.user.role === 1) {
      await this.endpointsService.remove(req.params.id);
      return res.status(200).json({ status: 200 });
    } else {
      throw new ForbiddenException();
    }
  };
}

export default EndpointsController;
