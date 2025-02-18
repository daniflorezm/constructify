import { useState } from "react";
import {
  createBillApi,
  getXlsxByIdApi,
  getPdfByIdApi,
  getPngByIdApi,
  getBillsApi,
  getBillByIdApi,
  getQuarterBillApi,
  deleteBillApi,
  deleteQuarterBillApi,
} from "../api/bills";
import { useStore } from "../stores/billStore";

export const useBill = () => {
  const { billData } = useStore();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      // Verificamos si faltan datos importantes
      const missingFields = [];
      if (!billData.customerDetails?.name)
        missingFields.push("Nombre del cliente");
      if (!billData.customerDetails?.cif) missingFields.push("CIF del cliente");
      if (!billData.customerDetails?.address)
        missingFields.push("Dirección del cliente");
      if (!billData.customerDetails?.phone_number)
        missingFields.push("Teléfono del cliente");
      if (!billData.paymentDetails?.payment_type)
        missingFields.push("Tipo de pago");
      if (!billData.paymentDetails?.account_number)
        missingFields.push("Número de cuenta");
      if (!billData.paymentDetails?.bank) missingFields.push("Banco");

      if (!billData.concepts || billData.concepts.length === 0) {
        missingFields.push("Al menos un concepto");
      }

      // Si faltan datos, mostrar una alerta antes de continuar
      if (missingFields.length > 0) {
        const confirmCreate = window.confirm(
          `A la factura le falta información:\n- ${missingFields.join(
            "\n- "
          )}\n\n¿Deseas crearla así?`
        );
        if (!confirmCreate) {
          setLoading(false);
          return;
        }
      }

      const newBill = {
        name: billData.customerDetails?.name || "",
        cif: billData.customerDetails?.cif || "",
        address: billData.customerDetails?.address || "",
        phone_number: billData.customerDetails?.phone_number || "",
        payment_type: billData.paymentDetails?.payment_type || "",
        account_number: billData.paymentDetails?.account_number || "",
        bank: billData.paymentDetails?.bank || "",
        concepts:
          Array.isArray(billData.concepts) && billData.concepts.length > 0
            ? billData.concepts.map((concept) => ({
                concept: concept.concept || "",
                ml: concept.ml || 0,
                metro_cuadrado: concept.metro_cuadrado || 0,
                jornales: concept.jornales || 0,
                horas: concept.horas || 0,
                und: concept.und || "",
                valor_por_unidad: concept.valor_por_unidad || 0,
              }))
            : [],
        iva: billData.extras.iva || 0,
        previous_bill: billData.extras.previous_bill || 0,
        desc_previous_bill: billData.extras.desc_previous_bill || 0,
        tag: tag,
      };

      const billGenerated = await createBillApi(JSON.stringify(newBill));
      const { billId } = billGenerated;
      await getXlsxByIdApi(billId);

      setTimeout(async () => {
        await getPdfByIdApi(billId);
      }, 2000);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const downloadBillFiles = async (billId: number) => {
    try {
      await getXlsxByIdApi(billId);
      setTimeout(async () => {
        await getPdfByIdApi(billId);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const loadBill = async (billId: number) => {
    try {
      const response = await getPngByIdApi(billId);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const viewBill = async (billId: number) => {
    try {
      const response = await getBillByIdApi(billId);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const getQuarterBill = async (quarter: number) => {
    try {
      const response = await getQuarterBillApi(quarter);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const deleteBill = async (id: number) => {
    try {
      const response = await deleteBillApi(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const deleteQuarterBill = async (quarter: number) => {
    try {
      const response = await deleteQuarterBillApi(quarter);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    createBill,
    listBills,
    viewBill,
    loadBill,
    getQuarterBill,
    deleteBill,
    deleteQuarterBill,
    downloadBillFiles,
    loading,
  };
};
