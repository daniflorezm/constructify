import { useState, useEffect } from "react";
import { Collapse, Divider, Button, Typography } from "antd";
import {
  LeftCircleFilled
} from "@ant-design/icons";
import { CustomerDetails, PaymentDetails, ConceptDetails } from "./index";
import { useBill } from "../../hooks/useBill";
import "./BillForm.scss";
export const BillForm = (props: any) => {
  const {Title} = Typography;
  const [expandCollapse, setExpandCollapse] = useState<string | string[]>([]);
  const [billTitle, setBillTitle] = useState<string>("")
  const { billFilled, returnToBillList } = props;
  const { createBill } = useBill();
  useEffect(() => {
    if (Object.keys(billFilled).length > 0) {
      setExpandCollapse(expandCollapse.length ? [] : ["1", "2", "3"]);
      setBillTitle(`FACTURA ${billFilled.bill[0].id}`)
    }
  }, [billFilled]);

  return (
    <div className="bill-form-component">
      <div className="bill-form-component-previous-button">
        <Button
          type="link"
          style={{ justifyContent: "flex-start", marginTop:15 }}
          onClick={() => returnToBillList()}
          icon={<LeftCircleFilled />}
        >
          Lista de facturas
        </Button>
        {billTitle.length > 0 ? (<Title level={3} italic underline>{billTitle}</Title>): ""}
      </div>
      <Divider orientation="left">Datos del cliente</Divider>
      <Collapse
        size="large"
        items={[
          {
            key: "1",
            label: "Información referente a los datos del cliente",
            children: <CustomerDetails billFilled={billFilled.bill} />,
          },
        ]}
        onChange={setExpandCollapse}
        activeKey={expandCollapse}
      />
      <Divider orientation="left">Detalles del pago</Divider>
      <Collapse
        size="large"
        items={[
          {
            key: "2",
            label: "Información referente a los detalles del pago",
            children: <PaymentDetails billFilled={billFilled.bill} />,
          },
        ]}
        onChange={setExpandCollapse}
        activeKey={expandCollapse}
      />
      <Divider orientation="left">Conceptos</Divider>
      <Collapse
        size="large"
        items={[
          {
            key: "3",
            label: "Información referente a los conceptos de la factura",
            children: (
              <ConceptDetails
                billFilled={billFilled.extra}
                conceptFilled={billFilled.concept}
              />
            ),
          },
        ]}
        onChange={setExpandCollapse}
        activeKey={expandCollapse}
      />
      <Divider orientation="left">Generación de factura</Divider>
      <div className="bill-form-component-button">
        <Button
          type="primary"
          onClick={() => createBill("MAIN")}
        >
          CREAR FACTURA PARA MARI SAN OBRAS Y SERVICIOS
        </Button>
        <Button
          type="primary"
          onClick={() => createBill("AUTONOMO")}
        >
          CREAR FACTURA PARA ELVER AUGUSTO
        </Button>
        <Button
          type="primary"
          onClick={() => createBill("PLANTILLA")}
        >
          CREAR PLANTILLA
        </Button>
      </div>
    </div>
  );
};
