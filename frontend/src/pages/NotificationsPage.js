import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const NotificationContent = () => {
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const notifications = [
    {
      id: 1,
      title: '2024 TREND CORE GRAND OPEN 안내',
      content: '안녕하세요. 트렌드코어 고객 여러분,\n\n 새로운 변화와 함께 2024년 10월 1일 트렌드코어 그랜드 오픈을 알리게 되어 기쁩니다.\n\n 이번 오픈을 기념하여 다양한 이벤트와 혜택을 준비했습니다. 오프라인 매장에서는 개장 기념 선착순 선물 증정, 추첨 이벤트 등이 진행될 예정입니다. 온라인 스토어에서도 오픈 기념 할인 및 적립금 증정 이벤트가 준비되어 있습니다.\n\n 트렌드코어의 새로운 변화에 많은 관심과 성원 부탁드립니다. 앞으로도 최선을 다해 고객 여러분께 더 나은 쇼핑 경험을 제공하겠습니다.',
      date: '2024.10.01'
    },
    {
      id: 2,
      title: '10월 1일 오픈 기념 이벤트 안내',
      content: '안녕하세요. 트렌드코어 고객 여러분,\n\n 2024년 10월 1일 그랜드 오픈을 기념하여 다양한 이벤트를 준비했습니다.\n\n 오프라인 매장에서는 선착순 기념품 증정, 추첨 이벤트 등이 진행될 예정입니다. 온라인 스토어에서도 오픈 기념 할인 및 적립금 증정 이벤트가 준비되어 있습니다.\n\n 많은 관심과 참여 부탁드립니다. 트렌드코어의 새로운 변화를 함께 만들어가겠습니다.',
      date: '2024.10.01'
    },
    {
      id: 3,
      title: '개인정보 처리방침 변경 안내',
      content: '안녕하세요. 트렌드코어 고객 여러분,\n\n 트렌드코어 개인정보 처리방침이 변경되었음을 안내드립니다.\n\n 이번 개정은 최근 개인정보 보호법 개정 사항을 반영하기 위함이며, 주요 변경 내용은 다음과 같습니다:\n\n - 개인정보 처리 목적 추가\n - 개인정보 보유 및 이용 기간 명시\n - 개인정보 파기 절차 및 방법 구체화\n - 정보주체의 권리 및 행사 방법 안내\n\n 변경된 개인정보 처리방침은 홈페이지에 게시되어 있으니 참고 부탁드립니다. 감사합니다.',
      date: '2024.10.16'
    },
    {
      id: 4,
      title: '온라인 스토어 교환 서비스 중단 안내',
      content: '안녕하세요. 트렌드코어 고객 여러분,\n\n 온라인 스토어의 교환 서비스 중단에 대해 안내드립니다.\n\n 고객님의 편리한 쇼핑 경험을 위해 노력하고 있는 트렌드코어는 온라인 스토어의 교환 서비스를 중단하게 되었습니다. 이는 교환 처리 과정의 비효율성 개선을 위한 결정이었습니다.\n\n 앞으로는 반품 서비스만 제공될 예정이며, 교환이 필요한 경우 반품 후 재구매를 해주셔야 합니다. 이용에 불편을 드려 죄송합니다. 고객 여러분의 양해 부탁드립니다.',
      date: '2024.10.19'
    },
    {
      id: 5,
      title: '새로운 브랜드 "CORE CLASSIC" 론칭 안내',
      content: '안녕하세요. 트렌드코어 고객 여러분,\n\n 트렌드코어에서 새로운 브랜드 "CORE CLASSIC"을 론칭하게 되었습니다.\n\n CORE CLASSIC은 트렌드코어의 주력 라인으로, 고급스러운 디자인과 프리미엄 소재를 사용하여 높은 품질의 의류를 선보입니다. 남녀노소 누구나 편안하게 착용할 수 있는 기본 아이템부터 트렌디한 스타일까지 다양한 제품을 구비하고 있습니다.\n\n 온/오프라인 매장에서 새로운 CORE CLASSIC 제품을 만나보시기 바랍니다. 많은 관심 부탁드립니다.',
      date: '2024.11.11'
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="px-24 py-16 bg-gray-50">
      <h1 className="text-center text-2xl font-bold mb-8">알림센터</h1>
      <div className="flex justify-center mb-6">
        <button className="px-4 py-2 border-b-2 border-black text-sm font-medium">공지</button>
      </div>
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-gray-600 text-sm uppercase">순번</th>
            <th className="px-6 py-3 text-left text-gray-600 text-sm uppercase">제목</th>
            <th className="px-6 py-3 text-left text-gray-600 text-sm uppercase">등록일</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <tr
                className={`border-t border-gray-200 cursor-pointer ${
                  expandedIndex === index ? 'bg-gray-100' : ''
                }`}
                onClick={() => toggleExpand(index)}
              >
                <td className="px-6 py-4 text-sm text-gray-700">{notification.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{notification.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{notification.date}</td>
              </tr>
              {expandedIndex === index && (
                <tr>
                  <td colSpan="3" className="px-10 py-8 bg-gray-100">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {notification.content}
                    </pre>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-10">
        <button className="px-4 py-2 rounded-md border hover:bg-gray-200 transition-colors text-sm">
          더 보기
          <svg
            className="ml-2"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#1F2937"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Notification = () => {
  return (
    <div className="NotificationPage min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <NotificationContent />
      </main>
      <Footer />
    </div>
  );
};

export default Notification;