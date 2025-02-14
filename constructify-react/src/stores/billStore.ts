/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface CustomerDetails {
  name: string;
  cif: string;
  address: string;
  phone_number: string;
}

interface PaymentDetails {
  payment_type: string;
  account_number: string;
  bank: string;
}

interface Concept {
  concept?: string;
  ml?: number;
  metro_cuadrado?: number;
  jornales?: number;
  horas?: number;
  und?: string;
  valor_por_unidad?: number;
}
interface Extra {
  iva?: number;
  previous_bill?: number;
  desc_previous_bill?: number;
}

interface Bill {
  customerDetails?: CustomerDetails;
  paymentDetails?: PaymentDetails;
  concepts: Concept[];
  extras: Extra;
  tag: string;
}

interface BillStore {
  billData: Bill;
  updateCustomerDetails: (details: CustomerDetails) => void;
  updatePaymentDetails: (details: PaymentDetails) => void;
  updateConcepts: (concept: Concept[]) => void;
  updateExtras: (extra: Extra) => void;
}

export const useStore = create<BillStore>((set) => ({
  billData: {
    customerDetails: {
      name: "",
      cif: "",
      address: "",
      phone_number: "",
    },
    paymentDetails: {
      payment_type: "",
      account_number: "",
      bank: "",
    },
    concepts: [],
    extras: {
      iva: 0,
      previous_bill: 0,
      desc_previous_bill: 0
    },
    tag: ""
  } satisfies Bill,
  updateCustomerDetails: (customerdetails) =>
    set((state) => ({
      billData: {
        ...state.billData,
        customerDetails: {
          ...state.billData.customerDetails,
          ...customerdetails,
        },
      },
    })),
  updatePaymentDetails: (paymentdetails) =>
    set((state) => ({
      billData: {
        ...state.billData,
        paymentDetails: {
          ...state.billData.paymentDetails,
          ...paymentdetails,
        },
      },
    })),
  updateConcepts: (concepts) =>
    set((state) => ({
      billData: {
        ...state.billData,
        concepts: concepts, // Reemplaza el array completo
      },
    })),
  updateExtras: (extra) =>
    set((state) => ({
      billData: {
        ...state.billData,
        extras: {
          ...state.billData.extras,
          ...extra,
        }
      },
    })),
}));
