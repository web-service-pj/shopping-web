import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';

const Dashboard = () => (
  <Card>
    <CardHeader title="관리자 대시보드에 오신 것을 환영합니다" />
    <CardContent>
      <p>왼쪽 메뉴에서 옷과 사용자를 관리할 수 있습니다.</p>
    </CardContent>
  </Card>
);

export default Dashboard;