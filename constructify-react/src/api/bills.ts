import { URL } from "../utils/constants";

export const createBillApi = async (bill: BodyInit) => {
  try {
    const url = `${URL}/bills/createBill`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bill,
    };
    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error("Error al crear la factura");
    }
    const result = await response.json();
    return result
  } catch (error) {
    console.log(error);
  }
};

export const getXlsxByIdApi = async (billId: number) => {
  try {
    const url = `${URL}/bills/${billId}/xlsx`
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    const response = await fetch(url, params);
    const blob = await response.blob(); // 1️⃣ Convertir la respuesta en un Blob
    const urlBlob = window.URL.createObjectURL(blob); // 2️⃣ Crear una URL temporal
    const link = document.createElement("a"); // 3️⃣ Crear un enlace
    link.href = urlBlob; // 4️⃣ Asignar la URL al enlace
    link.download = `factura_${billId}.xlsx`; // 5️⃣ Configurar el nombre del archivo
    document.body.appendChild(link); // 6️⃣ Añadir el enlace al DOM
    link.click(); // 7️⃣ Simular el clic para iniciar la descarga
    link.remove(); // 8️⃣ Eliminar el enlace del DOM
  } catch (error) {
    console.log(error); 
  }
}

export const getPdfByIdApi = async (billId: number) => {
  try {
    const url = `${URL}/bills/${billId}/pdf`
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    const response = await fetch(url, params);
    const blob = await response.blob(); // 1️⃣ Convertir la respuesta en un Blob
    const urlBlob = window.URL.createObjectURL(blob); // 2️⃣ Crear una URL temporal
    const link = document.createElement("a"); // 3️⃣ Crear un enlace
    link.href = urlBlob; // 4️⃣ Asignar la URL al enlace
    link.download = `factura_${billId}.pdf`; // 5️⃣ Configurar el nombre del archivo
    document.body.appendChild(link); // 6️⃣ Añadir el enlace al DOM
    link.click(); // 7️⃣ Simular el clic para iniciar la descarga
    link.remove(); // 8️⃣ Eliminar el enlace del DOM
  } catch (error) {
    console.log(error); 
  }
}
export const getPngByIdApi = async (billId: number) => {
  try {
    const url = `${URL}/bills/${billId}/png`
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    const response = await fetch(url, params);
    return response.url;
  } catch (error) {
    console.log(error); 
  }
}
export const getQuarterBillApi = async (quarter: number) => {
  try {
    const url = `${URL}/bills//getQuarterBills/${quarter}`
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    const response = await fetch(url, params);
    const blob = await response.blob(); // 1️⃣ Convertir la respuesta en un Blob
    const urlBlob = window.URL.createObjectURL(blob); // 2️⃣ Crear una URL temporal
    const link = document.createElement("a"); // 3️⃣ Crear un enlace
    link.href = urlBlob; // 4️⃣ Asignar la URL al enlace
    link.download = `facturas_trimestre_${quarter}.zip`; // 5️⃣ Configurar el nombre del archivo
    document.body.appendChild(link); // 6️⃣ Añadir el enlace al DOM
    link.click(); // 7️⃣ Simular el clic para iniciar la descarga
    link.remove(); // 8️⃣ Eliminar el enlace del DOM
  } catch (error) {
    console.log(error); 
  }
}
export const getBillsApi = async (quarter: number) => {
  try {
    const url = `${URL}/bills/${quarter}`
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export const getBillByIdApi = async (billId: number) => {
  try {
    const url = `${URL}/bills/filterBillById/${billId}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}
export const deleteBillApi = async (billId: number) => {
  try {
    const url = `${URL}/bills/deleteBill/${billId}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}
export const deleteQuarterBillApi = async (quarter: number) => {
  try {
    const url = `${URL}/bills/deleteQuarterBill/${quarter}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

