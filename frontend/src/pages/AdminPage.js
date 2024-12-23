import React, { useEffect }  from 'react';
import { Admin, Resource } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { WearList, WearEdit, WearCreate, WearShow } from '../components/admin/Wears';
import { UserList, UserEdit, UserShow } from '../components/admin/Users';
import { PurchaseList, PurchaseShow } from '../components/admin/Purchases';
import Dashboard from '../components/admin/Dashboard';
import customDataProvider from '../utils/dataProvider';

const AdminPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [navigate, user]);

  if (!user || !user.isAdmin) {
    return null;  // 또는 <div>접근 권한이 없습니다.</div>
  }

  return (
    <Admin basename="/admin" dashboard={Dashboard} dataProvider={customDataProvider}>
      <Resource name="wears" options={{ label: '옷' }} list={WearList} edit={WearEdit} create={WearCreate} show={WearShow} />
      <Resource name="users" options={{ label: '사용자' }} list={UserList} edit={UserEdit} show={UserShow} />
      <Resource name="buy" options={{ label: '구매목록' }} list={PurchaseList} show={PurchaseShow} />
    </Admin>
  );
};

export default AdminPage;