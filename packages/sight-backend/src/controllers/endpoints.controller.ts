import EndpointsService from '@services/endpoints.service';
import ForbiddenException from '@exceptions/ForbiddenException';
import NotFoundException from '@exceptions/NotFoundException';
import { CreateEndpointsDto, UpdateEndpointDto } from '@dtos/endpoints.dto';
import DockerService from '@services/docker.service';

class EndpointsController {
  public endpointsService = new EndpointsService();
  public dockerService = new DockerService();

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
    if (req.user.role === 1) return res.status(200).json(await this.endpointsService.getAll());
    else return res.status(200).json([]);
  };

  /**
   * @openapi
   *   /endpoints/{id}:
   *     get:
   *       tags:
   *       - endpoints
   *       summary: Fetch endpoint by ID
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
  public getEndpointById = async (req, res) => {
    const endpoint = await this.endpointsService.getOne(req.params.id);
    if (endpoint) {
      return res.status(200).json(endpoint);
    } else {
      throw new NotFoundException('Endpoint not found');
    }
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
    const endpointData: CreateEndpointsDto = req.body;
    await this.endpointsService.create({ ...endpointData });
    return res.status(201).json({ status: 201 });
  };

  /**
   * @openapi
   *   /endpoints/{id}:
   *     put:
   *       tags:
   *       - endpoints
   *       summary: Update endpoint by ID
   *       parameters:
   *       - name: id
   *         in: path
   *         description: Endpoint ID
   *         required: true
   *         type: string
   *       - name: body
   *         in: body
   *         description: UpdateEndpointDto
   *         required: true
   *         schema:
   *           $ref: '#/definitions/updateEndpointDto'
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'Endpoint not found'
   *         500:
   *           description: 'Server Error'
   */
  public update = async (req, res) => {
    const endpoint = await this.endpointsService.getOne(req.params.id);
    if (endpoint) {
      const endpointData: UpdateEndpointDto = req.body;
      await this.endpointsService.update(req.params.id, endpointData);
      return res.status(200).json({ status: 200 });
    } else {
      throw new NotFoundException('Endpoint not found');
    }
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
