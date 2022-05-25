import DockerService from '@services/docker.service';

class WebsocketController {
  public dockerService = new DockerService();

  public attach = async (ws, req) => {
    const { endpointId, id } = req.query;

    try {
      await this.dockerService.connect(endpointId);
      const container = await this.dockerService.service.docker.getContainer(id);
      await container.attach(
        {
          stream: true,
          stdout: true,
          stderr: true,
        },
        function handler(err, stream) {
          stream.on('data', chunk => {
            if (ws.readyState === 1) {
              ws.send(chunk.toString().slice(8) + '\t');
            }
          });
        },
      );
    } catch (err) {
      return ws.send({ status: 400, message: 'No connection' });
    }
  };
}

export default WebsocketController;
