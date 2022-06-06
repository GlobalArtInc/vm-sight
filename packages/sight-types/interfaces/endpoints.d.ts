export {EndpointI}

interface EndpointI {
    id: string;
    name: string;
    type: number;
    groupId: number;
    status: number;
    public_url: string;
    host: string;
    tls: number;
    tls_ca: number;
    tls_cert: number;
    tls_key: number;
}