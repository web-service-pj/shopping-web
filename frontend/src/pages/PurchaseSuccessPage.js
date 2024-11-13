import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage = ({ orderNumber }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          결제가 완료되었습니다!
        </h1>
        
        <p className="text-gray-600 mb-2">
          주문이 성공적으로 처리되었습니다.
        </p>
        
        {orderNumber && (
          <p className="text-sm text-gray-500 mb-6">
            주문번호: {orderNumber}
          </p>
        )}

        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition duration-300"
          >
            쇼핑 계속하기
          </button>
          
          <button
            onClick={() => navigate('/mypage')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition duration-300"
          >
            주문 내역 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;