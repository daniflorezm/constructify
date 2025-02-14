import { useEffect } from "react";
import { Form, Input } from "antd";
import {useStore} from "../../../stores/billStore"

interface CustomerDetails {
  name: string;
  cif: string;
  address: string;
  phone_number: string;
}

export const CustomerDetails = (props:any) => {
  const {billFilled} = props;
  const [form] = Form.useForm();
  const {updateCustomerDetails} = useStore();
  useEffect(() => {
    if (billFilled?.length){
      const customerDetail = {
        name: billFilled[0].name,
        cif: billFilled[0].cif,
        address: billFilled[0].address,
        phone_number: billFilled[0].phone_number
      }
      form.setFieldsValue(customerDetail);
      updateCustomerDetails(customerDetail)
    }
  }, [billFilled])
  
  const handleValuesChange = (
    changedValues: Partial<CustomerDetails>,
    allValues: CustomerDetails
  ) => {
    updateCustomerDetails(allValues);
  };
  return (
    <Form
      layout="vertical"
      form={form}
      onValuesChange={handleValuesChange}
      style={{ maxWidth: 600 }}
    >
      <Form.Item label="Nombre del cliente" name="name">
        <Input placeholder="nombre" />
      </Form.Item>
      <Form.Item label="CIF" name="cif">
        <Input placeholder="cif" />
      </Form.Item>
      <Form.Item label="Dirección" name="address">
        <Input placeholder="dirección" />
      </Form.Item>
      <Form.Item label="Teléfono" name="phone_number">
        <Input placeholder="teléfono" />
      </Form.Item>
    </Form>
  );
};
