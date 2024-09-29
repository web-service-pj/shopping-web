const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const User = require('./models/user');
const Wear = require('./models/wear');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// react 포트 맞추기
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', // React 앱의 주소
    credentials: true,
  }));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('쇼핑몰 API 서버');
});

// 데이터베이스 연결 테스트
sequelize.authenticate()
  .then(() => {
    console.log('데이터베이스 연결 성공');
    // 모델과 데이터베이스 동기화
    return sequelize.sync();
  })
  .then(() => {
    console.log('모델 동기화 완료');
  })
  .catch(err => {
    console.error('데이터베이스 연결 실패:', err);
  });

// 사용자 조회 테스트 라우트
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('사용자 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// Wear 모델 테스트 라우트
app.get('/wears', async (req, res) => {
    try {
      const wears = await Wear.findAll();
      res.json(wears);
    } catch (error) {
      console.error('의류 조회 실패:', error);
      res.status(500).json({ message: '서버 오류' });
    }
});

app.post('/register', async (req, res) => {
    try {
      const { name, email, phone, password, gender, address } = req.body;
  
      // 이메일 중복 체크
      const existingUser = await User.findOne({ where: { userid: email } });
      if (existingUser) {
          return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
      }

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 새 사용자 생성
      const newUser = await User.create({
        userid: email,
        userpw: hashedPassword,
        username: name,
        usergender: gender === 'female' ? 1 : 0,  // 여성이면 1, 그 외(남성)는 0
        userphone: phone,
        useraddress: address
      });
  
      res.status(201).json({ message: '회원가입 성공', user: newUser });
    } catch (error) {
      console.error('회원가입 실패:', error);
      res.status(500).json({ message: '서버 오류' });
    }
});

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { userid: email } });
  
      if (!user) {
        return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
      }
  
      const isMatch = await bcrypt.compare(password, user.userpw);
      if (!isMatch) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
  
      const token = jwt.sign({ id: user.useridx }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ message: '로그인 성공', token, user: { id: user.useridx, name: user.username } });
    } catch (error) {
      console.error('로그인 실패:', error);
      res.status(500).json({ message: '서버 오류' });
    }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});