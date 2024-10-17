const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const User = require('./models/user');
const Wear = require('./models/wear');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const xss = require('xss-clean');
const cors = require('cors');
const app = express();
const PORT = 3005;
const authRoutes = require('./routes/auth');
const crypto = require('crypto');

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

// body-parser 설정 (Express 4.16.0 이상에서는 내장됨)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());
app.use('/api/auth', authRoutes);

app.get('/api', (req, res) => {
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

app.post('/api/register', async (req, res) => {
  console.log('회원가입 요청 시작');
  try {
      const { name, email, phone, password, gender, address } = req.body;
      console.log('입력 데이터:', { name, email, phone, gender, address, passwordLength: password ? password.length : 0 });

      if (!name || !email || !phone || !password || !gender || !address) {
          console.log('누락된 필드 발견');
          return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          console.log('유효하지 않은 이메일 형식:', email);
          return res.status(400).json({ message: '유효한 이메일 주소를 입력해주세요.' });
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
          console.log('유효하지 않은 비밀번호 형식');
          return res.status(400).json({ message: '비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.' });
      }

      console.log('이메일 중복 체크 시작');
      const existingUser = await User.findOne({ where: { userid: email } });
      if (existingUser) {
          console.log('중복된 이메일 발견:', email);
          return res.status(400).json({ message: '사용할 수 없는 이메일입니다.' });
      }

      console.log('비밀번호 해싱 시작');
      const salt = crypto.randomBytes(16).toString('hex');
      console.log('생성된 솔트:', salt);

      const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      console.log('해싱된 비밀번호 생성 완료');

      console.log('새 사용자 생성 시작');
      const newUser = await User.create({
          userid: email,
          userpw: `${salt}:${hashedPassword}`,
          username: name,
          usergender: gender === 'female' ? 1 : 0,
          userphone: phone,
          useraddress: address
      });
      console.log('새 사용자 생성 완료:', newUser.userid);

      res.status(201).json({ message: '회원가입 성공', user: { id: newUser.useridx, name: newUser.username } });
      console.log('회원가입 성공 응답 전송');
  } catch (error) {
      console.error('회원가입 실패:', error);
      res.status(500).json({ message: '서버 오류' });
  }
  console.log('회원가입 요청 처리 종료');
});

app.post('/api/login', async (req, res) => {
  console.log('로그인 요청 시작');
  try {
      const { email, password } = req.body;
      console.log('로그인 시도:', email);

      console.log('사용자 조회 시작');
      const user = await User.findOne({ where: { userid: email } });
      if (!user) {
          console.log('사용자를 찾을 수 없음:', email);
          return res.status(400).json({ message: '로그인에 실패하였습니다.' });
      }
      console.log('사용자 찾음:', user.userid);

      console.log('비밀번호 검증 시작');
      const [salt, storedHash] = user.userpw.split(':');
      const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      
      if (hashedPassword !== storedHash) {
          console.log('비밀번호 불일치');
          return res.status(400).json({ message: '로그인에 실패하였습니다.' });
      }
      console.log('비밀번호 일치');

      console.log('JWT 토큰 생성 시작');
      const token = jwt.sign({ id: user.useridx }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT 토큰 생성 완료');

      res.json({ message: '로그인 성공', token, user: { id: user.useridx, name: user.username } });
      console.log('로그인 성공 응답 전송');
  } catch (error) {
      console.error('로그인 실패:', error);
      res.status(500).json({ message: '서버 오류' });
  }
  console.log('로그인 요청 처리 종료');
});

// 토큰 검증
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) return res.sendStatus(403);
    req.user = decodedToken;
    next();
  });
};

app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['useridx', 'userid', 'username', 'usergender', 'userphone', 'useraddress', 'userregdate', 'social_type']
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      id: user.useridx,
      email: user.userid,
      name: user.username,
      gender: user.usergender === 1 ? '여성' : user.usergender === 0 ? '남성' : null,
      phone: user.userphone,
      address: user.useraddress,
      registrationDate: user.userregdate,
      loginType: user.social_type
    });
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.get('/api/men-products', async (req, res) => {
  try {
    const menProducts = await Wear.findAll({
      where: {
        w_gender: {
          [Op.or]: [0, 2]
        }
      }
    });
    res.json(menProducts);
  } catch (error) {
    console.error('남성 제품 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.get('/api/women-products', async (req, res) => {
  try {
    const womenProducts = await Wear.findAll({
      where: {
        w_gender: {
          [Op.or]: [1, 2]
        }
      }
    });
    res.json(womenProducts);
  } catch (error) {
    console.error('여성 제품 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.get('/api/brands', async (req, res) => {
  try {
    const brands = await Wear.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('w_brand')), 'w_brand'],
        [Sequelize.literal('MAX(CASE WHEN w_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 ELSE 0 END)'), 'isNew']
      ],
      group: ['w_brand'],
      order: [['w_brand', 'ASC']]
    });
    res.json(brands);
  } catch (error) {
    console.error('브랜드 목록 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.get('/api/brand-products/:brandName', async (req, res) => {
  try {
    const { brandName } = req.params;
    const brandProducts = await Wear.findAll({
      where: {
        w_brand: {
          [Op.like]: `%${brandName}%`
        }
      }
    });
    res.json(brandProducts);
  } catch (error) {
    console.error('브랜드 제품 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 