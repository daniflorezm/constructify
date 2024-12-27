import { Router } from "express";
import apiBills from "../bills/controller";

const api = Router()

api.use('/bills', apiBills)

export default api;