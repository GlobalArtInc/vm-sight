import * as fs from 'fs';
import {dbQuery} from "../utils/DB";
import * as Docker from 'dockerode';

const getEndpoint = (endpoint) => {

    return {
        Id: endpoint.id,
        Name: endpoint.name,
        Type: endpoint.type,
        GroupId: endpoint.groupId,
        Status: endpoint.status,
        URL: endpoint.url,
        PublicURL: endpoint.publicURL,
        Snapshot: endpoint.snapshot
    };
}


class dockerService {
    public service = new Docker();
    public endpoint: any;

    constructor() {

    }

    public async connect(endpointId) {
        return dbQuery(`SELECT * FROM endpoints WHERE id = '${endpointId}'`).then((endpoint) => {
            if (endpoint['length'] > 0) {
                this.endpoint = endpoint[0]
                let settings: any = (endpoint[0].url.match('/var/run/docker.sock')) ?
                    {socketPath: '/var/run/docker.sock'} :
                    {
                        host: endpoint[0].url.split(':')[0],
                        port: endpoint[0].url.split(':')[1]
                    };

                if (endpoint[0].tls === 1) {
                    if (endpoint[0].tls_ca === 1) {
                        const path = `${global.data}/certs/${endpoint[0].id}/ca.pem`
                        if (fs.existsSync(path))
                            settings.ca = fs.readFileSync(path)
                    }
                    if (endpoint[0].tls_cert === 1) {
                        const path = `${global.data}/certs/${endpoint[0].id}/cert.pem`
                        if (fs.existsSync(path))
                            settings.cert = fs.readFileSync(path)
                    }
                    if (endpoint[0].tls_key === 1) {
                        const path = `${global.data}/certs/${endpoint[0].id}/key.pem`
                        if (fs.existsSync(path))
                            settings.key = fs.readFileSync(path)
                    }
                }
                this.service = new Docker(settings)
            } else {
                this.endpoint = false
            }
        })
    }

    public getEndpoint() {
        console.log('2')
    }

    public version() {
        return this.service.version()
    }

    public async test() {
        console.log(this.endpoint)
        // console.log(this.service.version())
        //  console.log(this.service)
    }

}

export default dockerService