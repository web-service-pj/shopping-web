import React from 'react';
import {
  List, Datagrid, TextField, EmailField, DateField, EditButton,
  Edit, SimpleForm, TextInput, DateInput,
  Show, SimpleShowLayout, Pagination
} from 'react-admin';

const UserPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;

export const UserList = (props) => (
  <List 
    {...props}
    pagination={<UserPagination />}
    perPage={25}
    sort={{ field: 'id', order: 'ASC' }}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <EmailField source="userid" label="이메일" />
      <TextField source="username" label="이름" />
      <TextField source="usergender" label="성별" />
      <TextField source="userphone" label="전화번호" />
      <DateField source="userregdate" label="가입일" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="userid" type="email" label="이메일" />
      <TextInput source="username" label="이름" />
      <TextInput source="usergender" label="성별" />
      <TextInput source="userphone" label="전화번호" />
      <TextInput source="useraddress" label="주소" />
      <DateInput disabled source="userregdate" label="가입일" />
    </SimpleForm>
  </Edit>
);

export const UserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <EmailField source="userid" label="이메일" />
      <TextField source="username" label="이름" />
      <TextField source="usergender" label="성별" />
      <TextField source="userphone" label="전화번호" />
      <TextField source="useraddress" label="주소" />
      <DateField source="userregdate" label="가입일" />
      <TextField source="social_type" label="소셜 로그인 타입" />
    </SimpleShowLayout>
  </Show>
);