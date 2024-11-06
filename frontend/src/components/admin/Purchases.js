import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
} from 'react-admin';

export const PurchaseList = (props) => (
  <List 
    {...props}
    pagination={false}
    sort={{ field: 'purchase_idx', order: 'DESC' }}
  >
    <Datagrid rowClick="show">
      <TextField source="order_number" label="주문번호" />
      <TextField source="username" label="구매자" />
      <TextField source="user_email" label="이메일" />
      <TextField source="product_name" label="상품명" />
      <TextField source="product_brand" label="브랜드" />
      <NumberField source="total_amount" label="결제금액" />
      <TextField source="status" label="주문상태" />
      <DateField source="purchase_date" label="구매일자" />
      <TextField source="size" label="사이즈" />
    </Datagrid>
  </List>
);

export const PurchaseShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="order_number" label="주문번호" />
      <TextField source="username" label="구매자" />
      <TextField source="user_email" label="이메일" />
      <TextField source="product_name" label="상품명" />
      <TextField source="product_brand" label="브랜드" />
      <NumberField source="product_price" label="상품가격" />
      <NumberField source="total_amount" label="결제금액" />
      <NumberField source="used_point" label="사용 포인트" />
      <TextField source="status" label="주문상태" />
      <DateField source="purchase_date" label="구매일자" />
      <TextField source="size" label="사이즈" />
      <TextField source="recipient_name" label="수령인" />
      <TextField source="recipient_phone" label="연락처" />
      <TextField source="recipient_address" label="배송주소" />
      <TextField source="delivery_request" label="배송요청사항" />
    </SimpleShowLayout>
  </Show>
);