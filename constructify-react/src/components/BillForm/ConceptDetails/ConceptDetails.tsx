/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Table, Button, Input, Checkbox, InputNumber } from "antd";
import { PlusOutlined, DeleteFilled } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useStore } from "../../../stores/billStore";
import "./ConceptDetails.scss";

interface ConceptType {
  key?: string;
  concept?: string;
  ml?: number;
  metro_cuadrado?: number;
  jornales?: number;
  horas?: number;
  und?: string;
  valor_por_unidad?: number;
}
interface Extra {
  key?: string
  iva?: number;
  previous_bill?: number;
  desc_previous_bill?: number;
}

export const ConceptDetails = (props: any) => {
  const { billFilled, conceptFilled } = props;
  const [previousBill, setPreviousBill] = useState(false);
  const [descPreviousBill, setDescPreviousBill] = useState(false);
  const [iva, setIva] = useState(false);
  const [extraPreviousBill, setExtraPreviousBill] = useState(false);
  const [extraDescPreviousBill, setExtraDescPreviousBill] = useState(false);
  const [extraIva, setExtraIva] = useState(false);
  const [conceptData, setConceptData] = useState<ConceptType[]>([]);
  const [extras, setExtras] = useState<Extra>({
    iva: 0,
    previous_bill: 0,
    desc_previous_bill: 0,
  });
  const { updateConcepts, updateExtras } = useStore();
  

  useEffect(() => {
    updateConcepts(conceptData);
    updateExtras(extras);
  }, [conceptData, extras]);

  useEffect(() => {
    if (billFilled?.length || conceptFilled?.length){
      setPreviousBill(true)
      setDescPreviousBill(true)
      setIva(true)
      setExtraIva(true)
      setExtraPreviousBill(true)
      setExtraDescPreviousBill(true)
      setExtras({
        iva: billFilled[0].iva,
        previous_bill: billFilled[0].previous_bill,
        desc_previous_bill: billFilled[0].desc_previous_bill
      })
      setConceptData(conceptFilled);      
    }
  }, [billFilled, conceptFilled]);


  const handleCheckExtras = (checked: boolean, extraConcept: string) => {
    if (extraConcept === "iva") {
      setIva(checked);
      setExtraIva(checked)
    } else if (extraConcept === "previous_bill") {
      setPreviousBill(checked);
      setExtraPreviousBill(checked)
    } else if (extraConcept === "desc_previous_bill") {
      setDescPreviousBill(checked);
      setExtraDescPreviousBill(checked)
    }
  };
  const handleInputChangeExtra = (value: any, extraConcept: string) => {
    if (extraConcept) {
      setExtras((prevExtras) => {
        const updatedExtras = { ...prevExtras, [extraConcept]: value };
        return updatedExtras;
      });
    }
  };
  const handleInputChangeConcepts = (
    index: number,
    key: keyof ConceptType,
    value: any
  ) => {
    const updatedData: any = [...conceptData];
    updatedData[index][key] = value;
    setConceptData(updatedData);
  };

  const addRow = () => {
    const newRow: ConceptType = {
      key: conceptData.length.toString(),
      concept: "",
      ml: 0,
      metro_cuadrado: 0,
      jornales: 0,
      horas: 0,
      und: "",
      valor_por_unidad: 0,
    };
    setConceptData([...conceptData, newRow]);
  };
  const deleteRow = (index: number) => {
    const updatedData = conceptData.filter((_, i) => i !== index);
    setConceptData(updatedData);
  };
  const columns: TableProps<ConceptType>["columns"] = [
    {
      dataIndex: "concept",
      title: "CONCEPTO",
      render: (text: string, record: ConceptType, index: number) => (
        <Input
          value={text}
          onChange={(e) =>
            handleInputChangeConcepts(index, "concept", e.target.value)
          }
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
          onChange={(e) =>
            handleInputChangeConcepts(index, "ml", e.target.value)
          }
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
          onChange={(e) =>
            handleInputChangeConcepts(index, "metro_cuadrado", e.target.value)
          }
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
          onChange={(e) =>
            handleInputChangeConcepts(index, "jornales", e.target.value)
          }
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
          onChange={(e) =>
            handleInputChangeConcepts(index, "horas", e.target.value)
          }
        />
      ),
    },
    {
      title: "UND",
      dataIndex: "und",
      render: (text: number, record: ConceptType, index: number) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleInputChangeConcepts(index, "und", e.target.value)
          }
        />
      ),
    },
    {
      title: "VALOR X UND",
      dataIndex: "valor_por_unidad",
      render: (text: number, record: ConceptType, index: number) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleInputChangeConcepts(index, "valor_por_unidad", e.target.value)
          }
        />
      ),
    },
    {
      dataIndex: "remove",
      render: (_, record: ConceptType, index: number) => (
        <Button
          type="primary"
          danger
          icon={<DeleteFilled />}
          onClick={() => deleteRow(index)}
        />
      ),
    },
  ];
  return (
    <div className="concept-details-component">
      <div className="concep-details-iva">
        <Checkbox onChange={(e) => handleCheckExtras(e.target.checked, "iva")} checked={extraIva}
        >
          I.V.A
        </Checkbox>
        {iva && (
          <>
            <InputNumber
              onChange={(value) => handleInputChangeExtra(value, "iva")} value={extras.iva}
            />
          </>
        )}
      </div>
      <div className="concep-details-previous-bill">
        <Checkbox
          onChange={(e) => handleCheckExtras(e.target.checked, "previous_bill")} checked={extraPreviousBill}
        >
          Factura anticipada
        </Checkbox>
        {previousBill && (
          <>
            <InputNumber
              onChange={(value) =>
                handleInputChangeExtra(value, "previous_bill")
              }
              value={extras.previous_bill}
            />
          </>
        )}
      </div>
      <div className="concep-details-desc-previous-bill">
        <Checkbox
          onChange={(e) =>
            handleCheckExtras(e.target.checked, "desc_previous_bill")
          }
          checked={extraDescPreviousBill}
        >
          Descuento por Factura Anticipada
        </Checkbox>
        {descPreviousBill && (
          <>
            <InputNumber
              onChange={(value) =>
                handleInputChangeExtra(value, "desc_previous_bill")
              }
              value={extras.desc_previous_bill}
            />
          </>
        )}
      </div>
      <div className="concept-details-component-add-button">
        <Button type="primary" icon={<PlusOutlined />} onClick={addRow} />
      </div>
      <Table columns={columns} dataSource={conceptData} />
    </div>
  );
};
