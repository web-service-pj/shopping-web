import React from 'react';
import {
  List, Datagrid, TextField, NumberField, DateField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, NumberInput, DateInput,
  Show, SimpleShowLayout, Pagination
} from 'react-admin';

export const WearList = (props) => (
  <List 
    {...props}
    pagination={false}
    sort={{ field: 'id', order: 'ASC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="w_name" label="이름" />
      <TextField source="w_brand" label="브랜드" />
      <NumberField source="w_price" label="가격" />
      <TextField source="w_category" label="카테고리" />
      <DateField source="w_date" label="등록일" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const WearEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="w_name" label="이름" />
      <TextInput source="w_brand" label="브랜드" />
      <NumberInput source="w_price" label="가격" />
      <TextInput source="w_size" label="사이즈" />
      <TextInput source="w_code" label="코드" />
      <TextInput source="w_path" label="이미지 경로" />
      <NumberInput source="w_volume" label="수량" />
      <TextInput source="w_category" label="카테고리" />
      <NumberInput source="w_gender" label="성별" />
      <TextInput source="w_stock" label="재고 상태" />
      <DateInput source="w_date" label="등록일" />
    </SimpleForm>
  </Edit>
);

export const WearCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="w_name" label="이름" />
      <TextInput source="w_brand" label="브랜드" />
      <NumberInput source="w_price" label="가격" />
      <TextInput source="w_size" label="사이즈" />
      <TextInput source="w_code" label="코드" />
      <TextInput source="w_path" label="이미지 경로" />
      <NumberInput source="w_volume" label="수량" />
      <TextInput source="w_category" label="카테고리" />
      <NumberInput source="w_gender" label="성별" />
      <TextInput source="w_stock" label="재고 상태" />
    </SimpleForm>
  </Create>
);

export const WearShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="w_name" label="이름" />
      <TextField source="w_brand" label="브랜드" />
      <NumberField source="w_price" label="가격" />
      <TextField source="w_size" label="사이즈" />
      <TextField source="w_code" label="코드" />
      <TextField source="w_path" label="이미지 경로" />
      <NumberField source="w_volume" label="수량" />
      <TextField source="w_category" label="카테고리" />
      <NumberField source="w_gender" label="성별" />
      <TextField source="w_stock" label="재고 상태" />
      <DateField source="w_date" label="등록일" />
    </SimpleShowLayout>
  </Show>
);