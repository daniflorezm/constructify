import { useEffect } from "react";
import { Form, Input } from "antd";
import {useStore} from "../../../stores/billStore"

interface PaymentDetails {
  payment_type: string,
  account_number: string,
  bank: string
}
export const PaymentDetails = (props) => {
  const {billFilled} = props;
  const [form] = Form.useForm();
  const {updatePaymentDetails} = useStore();
  useEffect(() => {
    if(billFilled?.length){
      const paymentDetail = {
        payment_type: billFilled[0].payment_type,
        account_number: billFilled[0].account_number,
        bank: billFilled[0].bank
      }
      form.setFieldsValue(paymentDetail);
      updatePaymentDetails(paymentDetail);
    }
  }, [billFilled])

  const handleValuesChange = (
      changedValues: Partial<PaymentDetails>,
      allValues: PaymentDetails
    ) => {
      updatePaymentDetails(allValues);
    };
    
    
  return (
    <Form
      layout="vertical"
      form={form}
      onValuesChange={handleValuesChange}
      style={{ maxWidth: 600 }}
    >
      <Form.Item label="Tipo de pago" name="payment_type">
        <Input placeholder="pago" />
      </Form.Item>
      <Form.Item label="Número de cuenta" name="account_number">
        <Input placeholder="numero de cuenta" />
      </Form.Item>
      <Form.Item label="Banco" name="bank">
        <Input placeholder="banco" />
      </Form.Item>
    </Form>
  );
};
