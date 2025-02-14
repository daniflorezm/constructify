import { Router } from "express";
import { getAllBills, getXlsx, getPdf, getPng, getBillById, getQuarterBills } from "./getbills";
import {createBill} from "./createbills";
import {deleteBill, deleteQuarterBills} from "./deletebills";

const apiBills = Router();

apiBills.post('/createBill', createBill)
apiBills.get('/:quarter', getAllBills )
apiBills.get('/:billId/xlsx', getXlsx )
apiBills.get('/:billId/pdf', getPdf )
apiBills.get('/:billId/png', getPng )
apiBills.get('/filterBillById/:billId', getBillById)
apiBills.get('/getQuarterBills/:quarter', getQuarterBills)
apiBills.get('/deleteBill/:id', deleteBill)
apiBills.get('/deleteQuarterBill/:quarter', deleteQuarterBills)

export default apiBills;
