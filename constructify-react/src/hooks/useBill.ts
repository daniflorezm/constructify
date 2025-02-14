import { createBillApi, getXlsxByIdApi, getPdfByIdApi, getPngByIdApi, getBillsApi, getBillByIdApi, getQuarterBillApi, deleteBillApi, deleteQuarterBillApi } from "../api/bills";
import { useStore } from "../stores/billStore";

export const useBill = () => {
  const { billData } = useStore();

  const listBills = async (quarter: number) => {
    try {
      const response = await getBillsApi(quarter);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const createBill = async (tag: string) => {
    try {
      console.log(billData.customerDetails)
      const newBill = {
        name: billData.customerDetails?.name || "",
        cif: billData.customerDetails?.cif || "",
        address: billData.customerDetails?.address || "",
        phone_number: billData.customerDetails?.phone_number || "",
        payment_type: billData.paymentDetails?.payment_type || "",
        account_number: billData.paymentDetails?.account_number || "",
        bank: billData.paymentDetails?.bank || "",
        concepts: billData.concepts?.map((concept) => ({
          concept: concept.concept,
          ml: concept.ml,
          metro_cuadrado: concept.metro_cuadrado,
          jornales: concept.jornales,
          horas: concept.horas,
          und: concept.und,
          valor_por_unidad: concept.valor_por_unidad,
        })),
        iva: billData.extras.iva,
        previous_bill: billData.extras.previous_bill,
        desc_previous_bill: billData.extras.desc_previous_bill,
        tag: tag,
      };
      const billGenerated = await createBillApi(JSON.stringify(newBill));
      const {billId} = billGenerated;      
      await getXlsxByIdApi(billId);
      setTimeout(async () => {
        await getPdfByIdApi(billId);
      }, 2000);
      
    } catch (err) {
      console.log(err);
    }
  };
  const downloadBillFiles = async (billId: number) =>{
    try {
      await getXlsxByIdApi(billId);
      setTimeout(async () => {
        await getPdfByIdApi(billId);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  }

  const loadBill = async (billId: number) => {
    try {
      const response = await getPngByIdApi(billId)
      return response
    } catch (error) {
      console.log(error)
    }
  }

  const viewBill = async (billId: number) => {
    try {
      const response = await getBillByIdApi(billId)
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  const getQuarterBill = async (quarter: number) => {
    try {
      const response = await getQuarterBillApi(quarter)
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  const deleteBill = async (id: number) => {
    try {
      const response = await deleteBillApi(id)
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  const deleteQuarterBill = async (quarter: number) => {
    try {
      const response = await deleteQuarterBillApi(quarter)
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  return { createBill, listBills, viewBill, loadBill, getQuarterBill, deleteBill, deleteQuarterBill, downloadBillFiles };
};
