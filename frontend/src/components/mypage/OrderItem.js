import React from 'react';
const OrderStatus = {
  PENDING: '배송 준비중',
  SHIPPING: '배송중',
  DELIVERED: '배송 완료',
  CANCELED: '주문 취소'
};
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-blue-100 text-blue-800';
    case 'SHIPPING':
      return 'bg-yellow-100 text-yellow-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
const OrderItem = ({ order }) => {
  const imagePath = order.Wear?.w_path ? 
    order.Wear.w_path.split(',')[0].trim() : 
    '/api/placeholder/240/240';
  return (
    <div className="border rounded-lg p-6 mb-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {new Date(order.purchase_date).toLocaleDateString()}
          </p>
          <p className="font-medium">주문번호: {order.order_number}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(order.status)}`}>
          {OrderStatus[order.status] || order.status}
        </span>
      </div>
      <div className="flex gap-4">
        <div className="w-40 h-70 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={imagePath}
            alt={order.Wear?.w_name || '상품 이미지'}
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/placeholder/240/240';
            }}
          />
        </div>
        <div className="flex-grow">
          <p className="font-medium mb-1">{order.Wear?.w_brand}</p>
          <p className="text-gray-600 mb-2">{order.Wear?.w_name}</p>
          <p className="text-sm text-gray-500">
            {order.size && `사이즈: ${order.size}`}
          </p>
          <p className="font-bold mt-2">
            {order.total_amount?.toLocaleString()}원
            {order.used_point > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                (포인트 사용: {order.used_point.toLocaleString()}원)
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600">
          수령인: {order.recipient_name}
        </p>
        <p className="text-sm text-gray-600">
          연락처: {order.recipient_phone}
        </p>
        <p className="text-sm text-gray-600">
          배송지: {order.recipient_address}
        </p>
        {order.delivery_request && (
          <p className="text-sm text-gray-600 mt-1">
            요청사항: {order.delivery_request}
          </p>
        )}
      </div>
    </div>
  );
};
export default OrderItem;