import React, { useState } from "react";
import "./BillList.scss";
import { Typography, List, Button } from "antd";
import { BillForm } from "../BillForm";

export const BillList = () => {
  const { Title } = Typography;
  const [openForm, setOpenForm] = useState(false);
  const data = [
    {
      title: "Factura 1",
    },
    {
      title: "Factura 2",
    },
    {
      title: "Factura 3",
    },
    {
      title: "Factura 4",
    },
  ];
  return (
    <div className="bill-list-component">
      {!openForm ? (
        <>
          <div className="bill-list-header">
            <Title>Lista de Facturas</Title>
            <Button type="primary" onClick={()=> setOpenForm(true)}>Crear Factura</Button>
          </div>
          <div className="bill-list-content">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta title={item.title} />
                </List.Item>
              )}
            />
          </div>
        </>
      ) : (
        <BillForm />
      )}
    </div>
  );
};
