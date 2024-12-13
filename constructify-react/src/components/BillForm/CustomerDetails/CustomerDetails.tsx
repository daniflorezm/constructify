import {Form, Input } from "antd";

export const CustomerDetails = () => {
    const [form] = Form.useForm();
    return (
      <Form
            layout="vertical"
            form={form}
            onValuesChange={() => console.log("")}
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Nombre del cliente">
              <Input placeholder="nombre" />
            </Form.Item>
            <Form.Item label="CIF">
              <Input placeholder="cif" />
            </Form.Item>
            <Form.Item label="Dirección">
              <Input placeholder="dirección" />
            </Form.Item>
            <Form.Item label="Teléfono">
              <Input type="number" placeholder="teléfono" />
            </Form.Item>
          </Form>
    )
  }