import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, DeleteFilled } from "@ant-design/icons";
import type { TableProps } from "antd";
import "./ConceptDetails.scss";

interface ConceptType {
  concepto: string;
  ml: number;
  metro_cuadrado: number;
  jornales: number;
  horas: number;
  unidad: number;
  valor_unidad: number;
}

export const ConceptDetails = () => {
    const columns: TableProps<ConceptType>["columns"] = [
        {
          dataIndex: "concepto",
          title: "CONCEPTO",
          render: (text: string, record: ConceptType, index: number) => (
            <Input
              value={text}
              onChange={(e) => handleInputChange(index, 'concepto', e.target.value)}
            />
          ),
        },
        {
          dataIndex: "ml",
          title: "ML",
          render: (text: number, record: ConceptType, index: number) => (
            <Input
              type="number"
              value={text}
              onChange={(e) => handleInputChange(index, 'ml', e.target.value)}
            />
          ),
        },
        {
            title: "M2",
            dataIndex: "metro_cuadrado",
            render: (text: number, record: ConceptType, index: number) => (
              <Input
                type="number"
                value={text}
                onChange={(e) => handleInputChange(index, 'metro_cuadrado', e.target.value)}
              />
            ),
          },
          {
            title: "JORNALES",
            dataIndex: "jornales",
            render: (text: number, record: ConceptType, index: number) => (
              <Input
                type="number"
                value={text}
                onChange={(e) => handleInputChange(index, 'jornales', e.target.value)}
              />
            ),
          },
          {
            title: "HORAS",
            dataIndex: "horas",
            render: (text: number, record: ConceptType, index: number) => (
              <Input
                type="number"
                value={text}
                onChange={(e) => handleInputChange(index, 'horas', e.target.value)}
              />
            ),
          },
          {
            title: "UND",
            dataIndex: "unidad",
            render: (text: number, record: ConceptType, index: number) => (
              <Input
                type="number"
                value={text}
                onChange={(e) => handleInputChange(index, 'unidad', e.target.value)}
              />
            ),
          },
          {
            title: "VALOR X UND",
            dataIndex: "valor_unidad",
            render: (text: number, record: ConceptType, index: number) => (
              <Input
                type="number"
                value={text}
                onChange={(e) => handleInputChange(index, 'valor_unidad', e.target.value)}
              />
            ),
          },
          {
            dataIndex: "remove",
            render: (_, record: ConceptType, index: number) => (
                <Button type="primary" icon={<DeleteFilled />} onClick={() => deleteRow(index)} />
              ),
          }
        ];
      
  const [data, setData] = useState<ConceptType[]>([]);
  const handleInputChange = (index: number, key: keyof ConceptType, value: any) => {
    const updatedData: any = [...data];
    updatedData[index][key] = value;
    setData(updatedData);
  };
  const addRow = () => {
    const newRow: ConceptType = {
        concepto: '',
        ml: 0,
        metro_cuadrado: 0,
        jornales: 0,
        horas: 0,
        unidad: 0,
        valor_unidad: 0
      };
    setData([...data, newRow]);
  };
  const deleteRow = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };
  console.log(data);
  return (
    <div className="concept-details-component">
      <div className="concept-details-component-add-button">
        <Button type="primary" icon={<PlusOutlined />} onClick={addRow} />
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};
