import DockerService from '@services/docker.service';

class DockerController {
  public dockerService = new DockerService();

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker containers by endpointId
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getContainers = async (req, res) => {
    const { endpointId } = req.params;
    return res.status(200).json(await this.dockerService.getContainers(endpointId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers/{containerId}:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker container by ID
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: containerId
   *          in: path
   *          description: Container ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getContainerById = async (req, res) => {
    const { endpointId, containerId } = req.params;
    return res.status(200).json(await this.dockerService.getContainer(endpointId, containerId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers/{containerId}/logs:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker container logs by ID
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: containerId
   *          in: path
   *          description: Container ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getContainerLogs = async (req, res) => {
    const { endpointId, containerId } = req.params;
    res.set('Content-Type', 'text/plain');
    const pattern = /\x1B\[([ABCD])/gm;
    const logs = await this.dockerService.getContainerLogs(endpointId, containerId, req.query);
    return res.send(logs.toString().replace(pattern, ''));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers/{containerId}:
   *     patch:
   *       tags:
   *       - docker
   *       summary: Execute a docker action
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: containerId
   *          in: path
   *          description: Container ID
   *          required: true
   *          type: string
   *        - name: body
   *          in: body
   *          description: Docker actions DTO
   *          required: true
   *          schema:
   *            $ref: '#/definitions/dockerActionsDto'
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public containerAction = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction(req.body.action, endpointId, containerId);
    return res.status(200).json();
  };

  public updateContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.updateContainer(endpointId, containerId, req.body);
    return res.status(200).json();
  };

  public removeContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction('remove', endpointId, containerId);
    return res.status(200).json();
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers/volumes:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker volumes by endpointId
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getVolumes = async (req, res) => {
    const { endpointId } = req.params;
    return res.status(200).json(await this.dockerService.getVolumes(endpointId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/volumes/{volumeUd}:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker volume by endpointId
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: volumeId
   *          in: path
   *          description: Volume ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getVolumeById = async (req, res) => {
    const { endpointId, volumeId } = req.params;
    return res.status(200).json(await this.dockerService.getVolumeById(endpointId, volumeId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/volumes:
   *     delete:
   *       tags:
   *       - docker
   *       summary: Create a docker volume
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public createVolume = async (req, res) => {
    const { endpointId } = req.params;
    await this.dockerService.createVolume(endpointId, req.body);
    return res.status(200).json({
      status: 200,
    });
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/volumes/{volumeUd}:
   *     delete:
   *       tags:
   *       - docker
   *       summary: Delete a docker volume by volumeId
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: volumeId
   *          in: path
   *          description: Volume ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public deleteVolumeById = async (req, res) => {
    const { endpointId, volumeId } = req.params;
    await this.dockerService.deleteVolumeById(endpointId, volumeId);
    return res.status(200).json();
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/networks:
   *     get:
   *       tags:
   *       - docker
   *       summary: Fetch all networks on endpoint
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         500:
   *           description: 'Server Error'
   */
  public getNetworks = async (req, res) => {
    const { endpointId } = req.params;
    return res.status(200).json(await this.dockerService.getNetworks(endpointId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/networks/{networkId}:
   *     get:
   *       tags:
   *       - docker
   *       summary: Fetch network
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: networkId
   *          in: path
   *          description: Network ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         500:
   *           description: 'Server Error'
   */
  public getNetworkById = async (req, res) => {
    const { endpointId, networkId } = req.params;
    return res.status(200).json(await this.dockerService.getNetworkById(endpointId, networkId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/networks:
   *     post:
   *       tags:
   *       - docker
   *       summary: Create a network
   *       parameters:
   *       - name: endpointId
   *         in: path
   *         description: Endpoint ID
   *         required: true
   *         type: string
   *       - name: body
   *         in: body
   *         description: CreateNetworkDto
   *         required: true
   *         schema:
   *           $ref: '#/definitions/CreateNetworkDto'
   *       responses:
   *         200:
   *           description: 'Ok'
   *         400:
   *           description: 'Bad Request'
   *         500:
   *           description: 'Server Error'
   */
  public createNetwork = async (req, res) => {
    const { endpointId } = req.params;
    await this.dockerService.createNetwork(endpointId, req.body);
    return res.status(200).json();
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/networks/{networkId}:
   *     delete:
   *       tags:
   *       - docker
   *       summary: Delete a network
   *       parameters:
   *       - name: endpointId
   *         in: path
   *         description: Endpoint ID
   *         required: true
   *         type: string
   *       - name: networkId
   *         in: path
   *         description: Network ID
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
  public deleteNetworkById = async (req, res) => {
    const { endpointId, networkId } = req.params;
    await this.dockerService.removeNetworkById(endpointId, networkId);
    return res.status(200).json();
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/networks/{networkId}/connect:
   *     post:
   *       tags:
   *       - docker
   *       summary: Connect a network
   *       parameters:
   *       - name: endpointId
   *         in: path
   *         description: Endpoint ID
   *         required: true
   *         type: string
   *       - name: networkId
   *         in: path
   *         description: networkId
   *         required: true
   *         type: string
   *       - name: body
   *         in: body
   *         description: Docker actions DTO
   *         required: true
   *         schema:
   *           $ref: '#/definitions/DockerNetworkActionsDto'
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'Endpoint not found'
   *         500:
   *           description: 'Server Error'
   */
  public connectNetwork = async (req, res) => {
    const { endpointId, networkId } = req.params;
    const { Container } = req.body;
    await this.dockerService.connectNetwork(endpointId, networkId, Container);
    return res.status(200).send({ status: 200 });
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/networks/{networkId}/disconnect:
   *     post:
   *       tags:
   *       - docker
   *       summary: Disconnect a network
   *       parameters:
   *       - name: endpointId
   *         in: path
   *         description: Endpoint ID
   *         required: true
   *         type: string
   *       - name: networkId
   *         in: path
   *         description: networkId
   *         required: true
   *         type: string
   *       - name: body
   *         in: body
   *         description: Docker actions DTO
   *         required: true
   *         schema:
   *           $ref: '#/definitions/DockerNetworkActionsDto'
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'Endpoint not found'
   *         500:
   *           description: 'Server Error'
   */
  public disconnectNetwork = async (req, res) => {
    const { endpointId, networkId } = req.params;
    const { Container } = req.body;
    await this.dockerService.disconnectNetwork(endpointId, networkId, Container);
    return res.status(200).send({ status: 200 });
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/images:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker images
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getImages = async (req, res) => {
    const { endpointId } = req.params;
    return res.status(200).json(await this.dockerService.getImages(endpointId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/images/{imageId}:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker image
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: imageId
   *          in: path
   *          description: imageId
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getImageById = async (req, res) => {
    const { endpointId, imageId } = req.params;
    return res.status(200).json(await this.dockerService.getImageById(endpointId, imageId));
  };

  public getImageHistoryById = async (req, res) => {
    const { endpointId, imageId } = req.params;
    return res.status(200).json(await this.dockerService.getImageHistoryById(endpointId, imageId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/images/{imageId}:
   *     delete:
   *       tags:
   *       - docker
   *       summary: Delete a docker image
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: imageId
   *          in: path
   *          description: ImageId
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public removeImageById = async (req, res) => {
    const { endpointId, imageId } = req.params;
    await this.dockerService.removeImageById(endpointId, imageId);
    return res.status(200).json();
  };
}

export default DockerController;
