import { Form, Input, InputNumber } from "antd";
export const PaymentDetails = () => {
  const [form] = Form.useForm();
  return (
    <Form
      layout="vertical"
      form={form}
      onValuesChange={() => console.log("")}
      style={{ maxWidth: 600 }}
    >
      <Form.Item label="Tipo de pago">
        <Input placeholder="pago" />
      </Form.Item>
      <Form.Item label="Número de cuenta">
        <Input placeholder="numero de cuenta" />
      </Form.Item>
      <Form.Item label="Banco">
        <Input placeholder="banco" />
      </Form.Item>
    </Form>
  );
};
