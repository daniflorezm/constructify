import { Collapse, Divider, Button} from "antd";
import {CustomerDetails, PaymentDetails, ConceptDetails} from "./index"
import "./BillForm.scss"
export const BillForm = () => {
  return (
    <div className="bill-form-component">
      <Divider orientation="left">Datos del cliente</Divider>
      <Collapse
        size="large"
        items={[
          {
            key: "customerDetails",
            label: "Información referente a los datos del cliente",
            children: <CustomerDetails/>
          }
        ]}
      />
      <Divider orientation="left">Detalles del pago</Divider>
      <Collapse
        size="large"
        items={[
          {
            key: "paymentDetails",
            label: "Información referente a los detalles del pago",
            children: <PaymentDetails/>
          },
        ]}
      />
      <Divider orientation="left">Conceptos</Divider>
      <Collapse
        size="large"
        items={[
          {
            key: "conceptDetails",
            label: "Información referente a los conceptos de la factura",
            children: <ConceptDetails/>
          },
        ]}  
      />
      <Divider orientation="left">Generación de factura</Divider>
      <div className="bill-form-component-button">
      <Button type="primary" style={{justifyContent: "center"}}>CREAR EXCEL</Button>
      </div>
    </div>
  );
};


