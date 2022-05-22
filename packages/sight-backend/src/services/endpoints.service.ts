import {EndpointsModel} from "../models";

class EndpointsService {
    public async getAll() {
        let arr = [];
        const endpoints = await EndpointsModel.findAll();
        for(const item of endpoints) {
            arr.push({

            })
        }
    }
}

export default EndpointsService;
