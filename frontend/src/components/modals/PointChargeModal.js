import React, { useState } from 'react';
import Modal from '../common/Modal';
import axios from 'axios';
const api = axios.create({
  baseURL: ''
});
const PointChargeModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSendVerification = async () => {
    try {
      setLoading(true);
      setError('');
      await api.post('/api/verification/send', { email });
      setStep(2);
    } catch (error) {
      setError('인증 이메일 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError('');
      await api.post('/api/verification/verify', {
        email,
        code: verificationCode
      });
      setStep(3);
    } catch (error) {
      setError('잘못된 인증번호입니다.');
    } finally {
      setLoading(false);
    }
  };
  const handleChargePoints = async () => {
    try {
      setLoading(true);
      setError('');
      await api.post('/api/points/charge', {
        amount: parseInt(amount),
        email
      });
      onSuccess(parseInt(amount));
      onClose();
    } catch (error) {
      setError('포인트 충전에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300"
              onClick={handleSendVerification}
              disabled={!email || loading}
            >
              {loading ? '처리중...' : '인증번호 받기'}
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                인증번호
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호를 입력하세요"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300"
              onClick={handleVerifyCode}
              disabled={!verificationCode || loading}
            >
              {loading ? '확인중...' : '인증번호 확인'}
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                충전 금액
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="충전할 금액을 입력하세요"
                className="w-full px-3 py-2 border rounded-md"
                min="1000"
                step="1000"
              />
            </div>
            <button
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300"
              onClick={handleChargePoints}
              disabled={!amount || loading}
            >
              {loading ? '충전중...' : '충전하기'}
            </button>
          </div>
        );
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? '포인트 충전 - 이메일 인증' :
             step === 2 ? '포인트 충전 - 인증번호 확인' :
             '포인트 충전 - 금액 입력'}
    >
      <div>
        {renderStep()}
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <div className="mt-4 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default PointChargeModal;