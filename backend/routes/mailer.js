const nodemailer = require('nodemailer');

const EMAIL_USER = 'binaryggyu@gmail.com';  
const EMAIL_PASSWORD = 'ajku pwfk dxze fqsw';

const transporter = nodemailer.createTransport({
  service: 'Gmail',  // 'gmail'이 아닌 'Gmail'로 수정
  auth: {
    user: EMAIL_USER,    // 공백 제거
    pass: EMAIL_PASSWORD // 공백 제거
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP 연결 실패:', error);
  } else {
    console.log('SMTP 서버 연결 성공');
  }
});

module.exports = transporter;