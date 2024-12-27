import { Router } from "express";
import { getAll, getById } from "./getbills";
import {createBill} from "./createbills";

const apiBills = Router();

apiBills.get('/', getAll )
apiBills.get('/:byId', getById )
apiBills.post('/createBill', createBill)

export default apiBills;
