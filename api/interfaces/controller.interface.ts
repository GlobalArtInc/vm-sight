import { Router } from 'express';
import DB from "../utils/DB";

interface Controller {
    path: string;
    router: Router;
}

export default Controller;