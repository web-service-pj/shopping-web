import React from 'react';
import { Admin, Resource } from 'react-admin';
import { WearList, WearEdit, WearCreate, WearShow } from '../components/admin/Wears';
import { UserList, UserEdit, UserShow } from '../components/admin/Users';
import Dashboard from '../components/admin/Dashboard';
import customDataProvider from '../utils/dataProvider';

const AdminPage = () => (
    <Admin basename="/admin" dashboard={Dashboard} dataProvider={customDataProvider}>
    <Resource name="wears" list={WearList} edit={WearEdit} create={WearCreate} show={WearShow} />
    <Resource name="users" list={UserList} edit={UserEdit} show={UserShow} />
  </Admin>
);

export default AdminPage;