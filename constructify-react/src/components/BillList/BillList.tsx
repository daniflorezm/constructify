import { useState, useEffect, useRef } from "react";
import "./BillList.scss";
import {
  Typography,
  Button,
  Table,
  TableColumnType,
  Input,
  Space,
  InputRef,
  Collapse,
  Divider,
  Modal,
  Tag,
  Image,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
  DeleteFilled,
  DeleteOutlined,
  EditFilled,
} from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import type { TableProps } from "antd";
import { BillForm } from "../BillForm";
import { useBill } from "../../hooks/useBill";
import elverlogo from "../logo/ElverLogo.png";
import Highlighter from "react-highlight-words";

interface BillList {
  key: string;
  id: number;
  customer: string;
  cif: string;
  address: string;
  phone_number: string;
  created_at: string;
  tag: string;
}

export const BillList = () => {
  const { Title } = Typography;
  const [openForm, setOpenForm] = useState(false);
  const [firstQuarterBills, setFirstQuarterBills] = useState<BillList[]>([]);
  const [secondQuarterBills, setSecondQuarterBills] = useState<BillList[]>([]);
  const [thirdQuarterBills, setThirdQuarterBills] = useState<BillList[]>([]);
  const [fourQuarterBills, setFourQuarterBills] = useState<BillList[]>([]);
  const [billFilled, setBillFilled] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openDeletionModal, setOpenDeletionModal] = useState(false);
  const [openQuarterDeletionModal, setOpenQuarterDeletionModal] =
    useState(false);
  const [openViewBillModal, setOpenViewBillModal] = useState(false);
  const [srcBill, setSrcBill] = useState<string>();
  const [billSelected, setBillSelected] = useState<{
    id: number;
    customer: string;
  } | null>(null);
  const [quarterSelected, setQuarterSelected] = useState<{
    quarter: number;
  } | null>(null);
  const searchInput = useRef<InputRef>(null);
  const {
    listBills,
    viewBill,
    loadBill,
    getQuarterBill,
    deleteBill,
    deleteQuarterBill,
    downloadBillFiles,
  } = useBill();

  const formatDate = (date: string) => {
    const dateFormated = new Date(date).toLocaleString();
    return dateFormated;
  };

  useEffect(() => {
    const getFirstBills = async () => {
      const response = await listBills(1);
      const mappedBills = response.map((bill: any, index: number) => ({
        key: index,
        id: bill.id,
        customer: bill.name,
        cif: bill.cif,
        address: bill.address,
        phone_number: bill.phone_number,
        created_at: formatDate(bill.created_at),
        quarter: bill.quarter,
        tag: bill.tag,
      }));
      setFirstQuarterBills(mappedBills);
    };
    const getSecondBills = async () => {
      const response = await listBills(2);
      const mappedBills = response.map((bill: any, index: number) => ({
        key: index,
        id: bill.id,
        customer: bill.name,
        cif: bill.cif,
        address: bill.address,
        phone_number: bill.phone_number,
        created_at: formatDate(bill.created_at),
        quarter: bill.quarter,
        tag: bill.tag,
      }));
      setSecondQuarterBills(mappedBills);
    };
    const getThirdBills = async () => {
      const response = await listBills(3);
      const mappedBills = response.map((bill: any, index: number) => ({
        key: index,
        id: bill.id,
        customer: bill.name,
        cif: bill.cif,
        address: bill.address,
        phone_number: bill.phone_number,
        created_at: formatDate(bill.created_at),
        quarter: bill.quarter,
        tag: bill.tag,
      }));
      setThirdQuarterBills(mappedBills);
    };
    const getFourBills = async () => {
      const response = await listBills(4);
      const mappedBills = response.map((bill: any, index: number) => ({
        key: index,
        id: bill.id,
        customer: bill.name,
        cif: bill.cif,
        address: bill.address,
        phone_number: bill.phone_number,
        created_at: formatDate(bill.created_at),
        quarter: bill.quarter,
        tag: bill.tag,
      }));
      setFourQuarterBills(mappedBills);
    };
    getFirstBills();
    getSecondBills();
    getThirdBills();
    getFourBills();
  }, []);

  const visualizeBill = async (billId: number) => {
    setOpenForm(true);
    const response = await viewBill(billId);
    setBillFilled(response);
  };
  const showModal = (id: number, customer: string) => {
    setBillSelected({ id, customer });
    setOpenDeletionModal(true);
  };
  const showQuarterModal = (quarter: number) => {
    setQuarterSelected({ quarter });
    setOpenQuarterDeletionModal(true);
  };
  const showViewBillModal = async (id: number, customer: string) => {
    setBillSelected({ id, customer });
    const response = await loadBill(id);
    setSrcBill(response);
    setOpenViewBillModal(true);
  };

  const onDeleteBill = async () => {
    if (billSelected) {
      await deleteBill(billSelected.id);

      setFirstQuarterBills((prevBills) =>
        prevBills.filter((bill) => bill.id !== billSelected.id)
      );
      setSecondQuarterBills((prevBills) =>
        prevBills.filter((bill) => bill.id !== billSelected.id)
      );
      setThirdQuarterBills((prevBills) =>
        prevBills.filter((bill) => bill.id !== billSelected.id)
      );
      setFourQuarterBills((prevBills) =>
        prevBills.filter((bill) => bill.id !== billSelected.id)
      );

      setOpenDeletionModal(false);
      setBillSelected(null);
    }
  };
  const onDeleteQuarterBill = async () => {
    if (quarterSelected) {
      await deleteQuarterBill(quarterSelected.quarter);
      setOpenQuarterDeletionModal(false);
      setQuarterSelected(null);
      window.location.reload();
    }
  };
  const downloadQuarterBills = async (quarter: number) => {
    const response = await getQuarterBill(quarter);
    console.log(response);
  };

  type DataIndex = keyof BillList;

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const returnToBillList = () => {
    location.reload();
  };
  const renderTag = (tag: string) => {
    if (tag == "MAIN") {
      return "geekblue";
    } else if (tag == "AUTONOMO") {
      return "orange";
    } else {
      return "cyan";
    }
  };
  const changeTagName = (tag: string) => {
    if (tag == "MAIN") {
      return "MARI SAN OBRAS Y SERVICIOS";
    } else if (tag == "AUTONOMO") {
      return "ELVER AUGUSTO";
    } else {
      return tag;
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<BillList> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Resetear
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps<BillList>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Emisor",
      dataIndex: "tags",
      render: (_, { tag }) => (
        <>
          <Tag color={renderTag(tag)} key={tag}>
            {changeTagName(tag)}
          </Tag>
        </>
      ),
    },
    {
      title: "Cliente",
      dataIndex: "customer",
      key: "customer",
      ...getColumnSearchProps("customer"),
    },
    {
      title: "CIF",
      dataIndex: "cif",
      ...getColumnSearchProps("cif"),
    },
    {
      title: "Teléfono",
      dataIndex: "phone_number",
      ...getColumnSearchProps("phone_number"),
    },
    {
      title: "Fecha de creación",
      dataIndex: "created_at",
      ...getColumnSearchProps("created_at"),
    },    
    {
      title: "",
      dataIndex: "viewBill",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showViewBillModal(record.id, record.customer)}
          ></Button>
          <Modal
            title={`Factura ${billSelected?.id}`}
            open={openViewBillModal}
            onOk={() => setOpenViewBillModal(false)}
            onCancel={() => setOpenViewBillModal(false)}
          >
            <Image width={470} src={srcBill} />
          </Modal>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "useBill",
      render: (_, record) => (
        <>
          <Button
            type="dashed"
            icon={<EditFilled />}
            onClick={() => visualizeBill(record.id)}
          >
            Usar Factura
          </Button>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "deleteBill",
      render: (_, record) => (
        <>
          <Button
            danger
            icon={<DeleteFilled />}
            onClick={() => showModal(record.id, record.customer)}
          >
            Eliminar Factura
          </Button>
          <Modal
            title={`Factura ${billSelected?.id}`}
            open={openDeletionModal}
            onOk={() => onDeleteBill()}
            onCancel={() => setOpenDeletionModal(false)}
          >
            <p>
              ¿Estás seguro que deseas borrar la factura del cliente{" "}
              {billSelected?.customer}?
            </p>
          </Modal>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "downloadBill",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => downloadBillFiles(record.id)}
          />
        </>
      ),
    },
  ];
  return (
    <div className="bill-list-component">
      {!openForm ? (
        <>
          <div className="bill-list-header">
            <Title>Lista de Facturas</Title>
            <img
              src={elverlogo}
              alt="Logo"
              style={{
                height: 150,
                width: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
            <Button type="primary" onClick={() => setOpenForm(true)}>
              Crear Factura
            </Button>
          </div>
          <div className="bill-list-content">
            <Divider orientation="left">
              Pertenecientes al primer trimestre
            </Divider>
            <div className="bill-list-operations-buttons">
              <Button
                icon={<DownloadOutlined />}
                type="link"
                onClick={() => downloadQuarterBills(1)}
              >
                Descargar facturas
              </Button>
              <Button
                icon={<DeleteOutlined />}
                type="link"
                danger
                onClick={() => showQuarterModal(1)}
              >
                Eliminar facturas
              </Button>
            </div>
            <Collapse
              size="large"
              items={[
                {
                  key: "1",
                  label: "Facturas Enero-Marzo",
                  children: (
                    <Table<BillList>
                      columns={columns}
                      dataSource={firstQuarterBills}
                      style={{ overflow: "auto" }}
                    />
                  ),
                },
              ]}
            />
            <Divider orientation="left">
              Pertenecientes al segundo trimestre
            </Divider>
            <div className="bill-list-operations-buttons">
              <Button
                icon={<DownloadOutlined />}
                type="link"
                onClick={() => downloadQuarterBills(2)}
              >
                Descargar facturas
              </Button>
              <Button
                icon={<DeleteOutlined />}
                type="link"
                danger
                onClick={() => showQuarterModal(2)}
              >
                Eliminar facturas
              </Button>
            </div>
            <Collapse
              size="large"
              items={[
                {
                  key: "2",
                  label: "Facturas Abril-Junio",
                  children: (
                    <Table<BillList>
                      columns={columns}
                      dataSource={secondQuarterBills}
                      style={{ overflow: "auto" }}
                    />
                  ),
                },
              ]}
            />
            <Divider orientation="left">
              Pertenecientes al tercer trimestre
            </Divider>
            <div className="bill-list-operations-buttons">
              <Button
                icon={<DownloadOutlined />}
                type="link"
                onClick={() => downloadQuarterBills(3)}
              >
                Descargar facturas
              </Button>
              <Button
                icon={<DeleteOutlined />}
                type="link"
                danger
                onClick={() => showQuarterModal(3)}
              >
                Eliminar facturas
              </Button>
            </div>
            <Collapse
              size="large"
              items={[
                {
                  key: "3",
                  label: "Facturas Julio-Septiembre",
                  children: (
                    <Table<BillList>
                      columns={columns}
                      dataSource={thirdQuarterBills}
                      style={{ overflow: "auto" }}
                    />
                  ),
                },
              ]}
            />
            <Divider orientation="left">
              Pertenecientes al cuarto trimestre
            </Divider>
            <div className="bill-list-operations-buttons">
              <Button
                icon={<DownloadOutlined />}
                type="link"
                onClick={() => downloadQuarterBills(4)}
              >
                Descargar facturas
              </Button>
              <Button
                icon={<DeleteOutlined />}
                type="link"
                danger
                onClick={() => showQuarterModal(4)}
              >
                Eliminar facturas
              </Button>
            </div>
            <Collapse
              size="large"
              items={[
                {
                  key: "3",
                  label: "Facturas Octubre-Diciembre",
                  children: (
                    <Table<BillList>
                      columns={columns}
                      dataSource={fourQuarterBills}
                      style={{ overflow: "auto" }}
                    />
                  ),
                },
              ]}
            />
            <Modal
              title={`¿Estás seguro que deseas eliminar todas las facturas pertenecientes al ${quarterSelected?.quarter} trimestre?`}
              open={openQuarterDeletionModal}
              onOk={() => onDeleteQuarterBill()}
              onCancel={() => setOpenQuarterDeletionModal(false)}
            />
          </div>
        </>
      ) : (
        <BillForm billFilled={billFilled} returnToBillList={returnToBillList} />
      )}
    </div>
  );
};
