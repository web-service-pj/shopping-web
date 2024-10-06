import React, { useState, useEffect } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import { useNavigate } from 'react-router-dom';

const PhoneInput = ({ value, onChange }) => {
    const [phone, setPhone] = useState({ part1: '', part2: '', part3: '' });
  
    useEffect(() => {
      onChange(Object.values(phone).join('-'));
    }, [phone, onChange]);
  
    const handleChange = (e, part) => {
      const newValue = e.target.value.replace(/\D/g, '');
      setPhone(prev => ({ ...prev, [part]: newValue }));
  
      if (newValue.length === (part === 'part1' ? 3 : 4)) {
        const nextInput = e.target.nextElementSibling?.nextElementSibling;
        if (nextInput) nextInput.focus();
      }
    };
  
    return (
      <div className="flex items-center">
        <input
          type="text"
          value={phone.part1}
          onChange={(e) => handleChange(e, 'part1')}
          maxLength="3"
          className="w-20 px-3 py-2 border border-gray-300 rounded-l"
          placeholder="010"
        />
        <span className="px-1">-</span>
        <input
          type="text"
          value={phone.part2}
          onChange={(e) => handleChange(e, 'part2')}
          maxLength="4"
          className="w-20 px-3 py-2 border border-gray-300"
          placeholder="0000"
        />
        <span className="px-1">-</span>
        <input
          type="text"
          value={phone.part3}
          onChange={(e) => handleChange(e, 'part3')}
          maxLength="4"
          className="w-20 px-3 py-2 border border-gray-300 rounded-r"
          placeholder="0000"
        />
      </div>
    );
  };
  
const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    over14: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    address: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (step === 1) {
      const { over14, agreeTerms, agreePrivacy } = formData;
      setIsFormValid(over14 && agreeTerms && agreePrivacy);
    } else if (step === 2) {
      const { name, email, phone, password, confirmPassword, gender, address } = formData;
      setIsFormValid(
        name && email && phone && password && confirmPassword && gender && address &&
        password === confirmPassword &&
        password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)
      );
    }
  }, [formData, step]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isFormValid) {
      if (step === 1) {
        setStep(2);
      } else {
        try {
          const response = await fetch('http://113.198.66.75:13070/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              gender: formData.gender,
              address: formData.address
            }),
          });
  
          const data = await response.json();

          if (response.ok) {
            console.log('회원가입 성공:', data);
            alert('회원가입에 성공했습니다!');
            navigate('/');
          } else {
            console.error('회원가입 실패:', data.message);
            alert(`회원가입에 실패했습니다: ${data.message}`);
            navigate('/login');  // 로그인 페이지로 이동
          }
        } catch (error) {
          console.error('회원가입 요청 중 오류 발생:', error);
          alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
          navigate('/login');  // 로그인 페이지로 이동
        }
      }
    }
  };

  const renderStep1 = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6">주식회사 트렌드 코어 통합회원 가입 안내</h2>
      <p className="mb-6 text-sm text-gray-600">
        주식회사 트렌드 코어의 통합회원 가입을 환영합니다.<br />
        회원으로 가입하시면 주식회사 트렌드 코어에서 운영하는 브랜드의<br />
        온/오프라인 스토어의 회원 혜택을 하나의 계정으로 이용하실 수 있습니다.<br />
        <br />
        <span className="text-lg font-bold">온라인 스토어</span><br />
        트렌드 코어 온라인 스토어: www.trend-core.co.kr<br />
        <br />
        <span className="text-lg font-bold">오프라인 스토어</span><br />
        서울 강남점<br />
        서울 성수점<br />
        인천 청라점<br />
        전북 전주점<br />
        경기 안산점<br />
        서울 홍대점<br />
        서울 이태원점<br />
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="over14"
              checked={formData.over14}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <span className="text-sm">만 14세 이상 가입 동의 <span className="text-red-500">(필수)</span></span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <span className="text-sm">이용약관 동의 <span className="text-red-500">(필수)</span></span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <span className="text-sm">개인정보 수집・이용 동의 <span className="text-red-500">(필수)</span></span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agreeMarketing"
              checked={formData.agreeMarketing}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <span className="text-sm">마케팅 정보 수신 동의 <span className="text-gray-500">(선택)</span></span>
          </label>
        </div>
        
        <button
          type="submit"
          className={`w-full py-3 px-4 ${
            isFormValid
              ? 'bg-black text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } rounded transition duration-300 text-sm font-semibold`}
          disabled={!isFormValid}
        >
          다음
        </button>
      </form>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="text-2xl font-semibold mb-6">회원 정보 입력</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="ex) 홍길동"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="email@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">전화번호</label>
          <PhoneInput
            value={formData.phone}
            onChange={(value) => handleInputChange({ target: { name: 'phone', value } })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
          <p className="text-xs text-gray-500 mt-1">대문자, 소문자, 특수문자 포함 8자리 이상</p>
        </div>
        <div>
          <label className="block text-sm mb-1">비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">성별</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          >
            <option value="">선택해주세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">주소</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 px-4 ${
            isFormValid
              ? 'bg-black text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } rounded transition duration-300 text-sm font-semibold`}
          disabled={!isFormValid}
        >
          회원 가입
        </button>
      </form>
    </>
  );

  return (
    <div className="SignUpPage">
      <Header />
      <main className="p-5 bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;