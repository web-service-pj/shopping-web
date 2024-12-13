const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const User = require('./models/user');
const Wear = require('./models/wear');
const ShoppingCart = require('./models/shopping_cart');
const PurchaseList = require('./models/purchase_list');
const VerificationCode = require('./models/verification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const xss = require('xss-clean');
const cors = require('cors');
const app = express();
const PORT = 80;
const authRoutes = require('./routes/auth');
const crypto = require('crypto');
const adminAuth = require('./routes/adminAuth');
const transporter = require('./routes/mailer');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

dotenv.config();

app.use(cors({
  origin: [
    'https://www.trendcore.store:8080',
    'https://www.trendcore.store',
    'http://113.198.66.75:10052'  
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count', 'Range'],
  exposedHeaders: ['Content-Range', 'X-Total-Count', 'Access-Control-Expose-Headers'],
  credentials: true 
}));

// body-parser 설정 (Express 4.16.0 이상에서는 내장됨)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());
app.use('/api/auth', authRoutes);
app.use('/api/admin/*', adminAuth);
app.use('/api/wears', adminAuth);
app.use('/api/users', adminAuth);
app.use('/api/buy', adminAuth);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
      const token = jwt.sign({ id: user.useridx, email: user.userid, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT 토큰 생성 완료');

      res.json({ message: '로그인 성공', token, user: { id: user.useridx, name: user.username, email: user.userid, isAdmin: user.isAdmin } });
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
      attributes: ['useridx', 'userid', 'username', 'usergender', 'userphone', 'useraddress', 'userregdate', 'social_type', 'points']
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
      loginType: user.social_type,
      points: user.points || 0
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

app.post('/api/shopping-cart', authenticateToken, async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { wearidx, quantity, size, w_code, w_gender } = req.body;
    const userId = req.user.id;

    // 사용자 정보 조회
    const user = await User.findByPk(userId, {
      attributes: ['userid']
    }, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 상품 정보 조회
    const wear = await Wear.findByPk(wearidx, { transaction: t });
    if (!wear) {
      await t.rollback();
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    // 재고 확인
    const stockBySize = {};
    wear.w_stock.split(';').forEach(group => {
      group.split(',').forEach(entry => {
        const [sizeKey, stock] = entry.split(':').map(s => s.trim());
        stockBySize[sizeKey] = parseInt(stock);
      });
    });

    if (!stockBySize[size]) {
      await t.rollback();
      return res.status(400).json({ message: '선택한 사이즈의 재고가 없습니다.' });
    }

    if (stockBySize[size] < quantity) {
      await t.rollback();
      return res.status(400).json({ 
        message: '재고가 부족합니다.',
        available: stockBySize[size]
      });
    }

    // 이미 장바구니에 있는 상품인지 확인
    const existingCartItem = await ShoppingCart.findOne({
      where: {
        userid: user.userid,
        wearidx: wearidx,
        size: size
      }
    }, { transaction: t });

    if (existingCartItem) {
      // 이미 있는 상품이면 수량만 업데이트
      const newQuantity = existingCartItem.quantity + quantity;
      if (stockBySize[size] < newQuantity) {
        await t.rollback();
        return res.status(400).json({ 
          message: '재고가 부족합니다.',
          available: stockBySize[size]
        });
      }

      await existingCartItem.update({
        quantity: newQuantity
      }, { transaction: t });

      await t.commit();
      return res.json({ 
        message: '장바구니 수량이 업데이트되었습니다.',
        cartItem: existingCartItem
      });
    }

    // 새로운 장바구니 아이템 생성
    const cartItem = await ShoppingCart.create({
      userid: user.userid,
      wearidx: wearidx,
      quantity: quantity,
      size: size,
      w_code: w_code,
      w_gender: w_gender
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ 
      message: '장바구니에 상품이 추가되었습니다.',
      cartItem: cartItem
    });

  } catch (error) {
    await t.rollback();
    console.error('장바구니 추가 실패:', error);
    res.status(500).json({ message: '장바구니 추가 중 오류가 발생했습니다.' });
  }
});

app.post('/api/purchase', authenticateToken, async (req, res) => {
  console.log('구매 요청 시작');
  const t = await sequelize.transaction();
  
  try {
    const { 
      wearidx,
      selectedSize,
      quantity = 1,
      recipientName, 
      recipientPhone, 
      recipientAddress,
      deliveryRequest,
      totalAmount,
      usedPoint,
      couponCode,
      isCartPurchase = false
    } = req.body;

    const useridx = req.user.id;

    // 상품 재고 확인
    const wear = await Wear.findByPk(wearidx, { transaction: t });
    if (!wear) {
      await t.rollback();
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    // 사이즈별 재고 파싱
    const stockBySize = {};
    const sizeGroups = wear.w_stock.split(';');
    
    sizeGroups.forEach(group => {
      const sizeEntries = group.split(',');
      sizeEntries.forEach(entry => {
        const [size, stock] = entry.split(':');
        stockBySize[size] = parseInt(stock);
      });
    });

    // 선택한 사이즈의 재고 확인
    if (!stockBySize.hasOwnProperty(selectedSize)) {
      await t.rollback();
      return res.status(400).json({ message: '유효하지 않은 사이즈입니다.' });
    }

    if (stockBySize[selectedSize] < quantity) {
      await t.rollback();
      return res.status(400).json({ 
        message: '선택한 사이즈의 재고가 부족합니다.',
        available: stockBySize[selectedSize]
      });
    }

    // 사용자 확인 및 포인트 검증
    const user = await User.findByPk(useridx, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    if (user.points < totalAmount) {
      await t.rollback();
      return res.status(400).json({ message: '포인트가 부족합니다.' });
    }

    const orderNumber = generateOrderNumber();
    
    // 재고 업데이트
    stockBySize[selectedSize] -= quantity;
    const newStockString = sizeGroups.map(group => {
      return group.split(',').map(entry => {
        const [size, _] = entry.split(':');
        return `${size}:${stockBySize[size]}`;
      }).join(',');
    }).join(';');

    await wear.update({
      w_stock: newStockString
    }, { transaction: t });

    // 구매 기록 생성
    const purchase = await PurchaseList.create({
      useridx,
      wearidx,
      size: selectedSize,
      quantity,
      order_number: orderNumber,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      recipient_address: recipientAddress,
      delivery_request: deliveryRequest,
      total_amount: totalAmount,
      used_point: totalAmount, // totalAmount가 곧 사용한 포인트
      coupon_code: couponCode,
      status: 'PENDING'
    }, { transaction: t });

    // 포인트 차감
    await user.update({
      points: user.points - totalAmount // 포인트 차감
    }, { transaction: t });

    // 장바구니에서 주문한 경우 해당 상품 삭제
    if (isCartPurchase) {
      await ShoppingCart.destroy({
        where: { 
          userid: user.userid,
          wearidx: wearidx
        },
        transaction: t
      });
    }

    await t.commit();
    
    res.status(201).json({
      message: '주문이 완료되었습니다.',
      orderNumber: orderNumber,
      purchase: purchase,
      remainingPoints: user.points - totalAmount // 남은 포인트 정보 전달
    });

  } catch (error) {
    await t.rollback();
    console.error('구매 처리 실패:', error);
    res.status(500).json({ message: '주문 처리 중 오류가 발생했습니다.' });
  }
});

// 장바구니 전체 비우기 API 추가
app.delete('/api/shopping-cart/all', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    await ShoppingCart.destroy({
      where: { userid: user.userid }
    });

    res.json({ message: '장바구니가 비워졌습니다.' });
  } catch (error) {
    console.error('장바구니 비우기 실패:', error);
    res.status(500).json({ message: '장바구니 비우기 중 오류가 발생했습니다.' });
  }
});

// 장바구니 조회 API
app.get('/api/shopping-cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 사용자 ID로 이메일 주소 조회
    const user = await User.findByPk(userId, {
      attributes: ['userid']
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const userEmail = user.userid;
    console.log('User Email:', userEmail);

    const cartItems = await ShoppingCart.findAll({
      where: { userid: userEmail },
      attributes: ['cart_idx', 'userid', 'wearidx', 'w_code', 'w_gender', 'quantity', 'added_date', 'size']
    });

    console.log('Cart items found:', cartItems);

    if (cartItems.length === 0) {
      console.log('No cart items found for user:', userEmail);
      return res.json([]);
    }

    const wearIds = cartItems.map(item => item.wearidx);
    console.log('Wear IDs:', wearIds);

    const wearItems = await Wear.findAll({
      where: { wearidx: wearIds },
      attributes: ['wearidx', 'w_name', 'w_price', 'w_path', 'w_brand']
    });

    console.log('Wear items found:', wearItems);

    const combinedCartItems = cartItems.map(cartItem => {
      const wearItem = wearItems.find(wear => wear.wearidx === cartItem.wearidx);
      return {
        ...cartItem.toJSON(),
        wear: wearItem ? wearItem.toJSON() : null
      };
    });

    console.log('Combined cart items:', combinedCartItems);

    res.json(combinedCartItems);
  } catch (error) {
    console.error('장바구니 조회 실패:', error);
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

// 장바구니 아이템 수량 업데이트 API
app.put('/api/shopping-cart/:cartItemId', authenticateToken, async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // 사용자 정보 조회
    const user = await User.findByPk(userId, {
      attributes: ['userid']
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 장바구니 아이템 조회
    const cartItem = await ShoppingCart.findOne({
      where: { 
        cart_idx: cartItemId,
        userid: user.userid
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: '장바구니 아이템을 찾을 수 없습니다.' });
    }

    // 수량 유효성 검사
    if (quantity <= 0) {
      return res.status(400).json({ message: '수량은 1개 이상이어야 합니다.' });
    }

    // 재고 확인
    const wear = await Wear.findByPk(cartItem.wearidx);
    if (!wear) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    // 수량 업데이트
    cartItem.quantity = quantity;
    await cartItem.save();

    // 업데이트된 정보 조회
    const updatedCartItem = await ShoppingCart.findOne({
      where: { cart_idx: cartItemId },
      include: [{
        model: Wear,
        attributes: ['wearidx', 'w_name', 'w_price', 'w_path', 'w_brand']
      }]
    });

    // 응답 데이터 구성
    const responseData = {
      message: '장바구니 아이템이 업데이트되었습니다.',
      cartItem: {
        cart_idx: updatedCartItem.cart_idx,
        quantity: updatedCartItem.quantity,
        userid: updatedCartItem.userid,
        wearidx: updatedCartItem.wearidx,
        w_code: updatedCartItem.w_code,
        w_gender: updatedCartItem.w_gender,
        Wear: updatedCartItem.Wear ? {
          wearidx: updatedCartItem.Wear.wearidx,
          w_name: updatedCartItem.Wear.w_name,
          w_price: updatedCartItem.Wear.w_price,
          w_path: updatedCartItem.Wear.w_path,
          w_brand: updatedCartItem.Wear.w_brand
        } : null
      }
    };

    res.json(responseData);

  } catch (error) {
    console.error('장바구니 아이템 업데이트 실패:', error);
    res.status(500).json({ 
      message: '서버 오류',
      error: error.message 
    });
  }
});

// 장바구니 아이템 삭제 API
app.delete('/api/shopping-cart/:cartItemId', authenticateToken, async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user.id;

    // 사용자 정보 조회
    const user = await User.findByPk(userId, {
      attributes: ['userid']
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 장바구니 아이템이 해당 사용자의 것인지 확인 후 삭제
    const result = await ShoppingCart.destroy({
      where: { 
        cart_idx: cartItemId,
        userid: user.userid  // 이메일 주소로 확인
      }
    });

    if (result === 0) {
      return res.status(404).json({ message: '장바구니 아이템을 찾을 수 없습니다.' });
    }

    res.json({ 
      message: '장바구니 아이템이 삭제되었습니다.',
      success: true 
    });
  } catch (error) {
    console.error('장바구니 아이템 삭제 실패:', error);
    res.status(500).json({ 
      message: '서버 오류',
      error: error.message 
    });
  }
});

// 개별 상품 정보 조회 API
app.get('/api/products/:productCode', async (req, res) => {
  try {
    const { productCode } = req.params;
    const product = await Wear.findOne({
      where: { w_code: productCode },
      attributes: [
        'wearidx', 'w_code', 'w_name', 'w_price', 'w_path', 
        'w_brand', 'w_gender', 'w_category', 'w_size', 'w_stock', 'size'
      ]
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(product);
  } catch (error) {
    console.error('상품 정보 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.get('/api/current-user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['useridx', 'userid', 'username', 'usergender', 'userphone', 'useraddress', 'userregdate', 'points']
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      userId: user.useridx,
      email: user.userid,
      name: user.username,
      gender: user.usergender === 1 ? '여성' : '남성',
      phone: user.userphone,
      address: user.useraddress,
      registrationDate: user.userregdate,
      points: user.points
    });
  } catch (error) {
    console.error('현재 사용자 정보 조회 실패:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});


app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 





// 주문 번호 생성 함수
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}${day}-${random}`;
};

// 구매 API
// 구매 내역 조회 API
app.get('/api/purchases', authenticateToken, async (req, res) => {
  try {
    const purchases = await PurchaseList.findAll({
      where: { useridx: req.user.id },
      include: [{
        model: Wear,
        attributes: ['w_name', 'w_price', 'w_path', 'w_brand']
      }],
      attributes: {
        include: ['size', 'quantity'] // size와 quantity 필드 명시적 포함
      },
      order: [['purchase_date', 'DESC']]
    });

    res.json(purchases);
  } catch (error) {
    console.error('구매 내역 조회 실패:', error);
    res.status(500).json({ message: '구매 내역 조회 중 오류가 발생했습니다.' });
  }
});

// 단일 구매 내역 조회 API
app.get('/api/purchases/:orderNumber', authenticateToken, async (req, res) => {
  try {
    const purchase = await PurchaseList.findOne({
      where: { 
        order_number: req.params.orderNumber,
        useridx: req.user.id
      },
      include: [{
        model: Wear,
        attributes: ['w_name', 'w_price', 'w_path', 'w_brand']
      }]
    });

    if (!purchase) {
      return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
    }

    res.json(purchase);
  } catch (error) {
    console.error('구매 내역 조회 실패:', error);
    res.status(500).json({ message: '구매 내역 조회 중 오류가 발생했습니다.' });
  }
});

app.get('/api/wears', async (req, res) => {
  try {
    const { _sort = 'wearidx', _order = 'ASC' } = req.query;

    const wears = await Wear.findAll({
      order: [[_sort, _order]]
    });

    const mappedWears = wears.map(wear => ({
      id: wear.wearidx,
      ...wear.toJSON()
    }));

    const count = wears.length;
    
    res.set('Content-Range', `wears 0-${count}/${count}`);
    res.set('X-Total-Count', count.toString());
    res.json(mappedWears);
  } catch (error) {
    console.error('Error fetching wears:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/wears/:id', async (req, res) => {
  try {
    const wear = await Wear.findByPk(req.params.id);
    if (wear) {
      res.json({
        id: wear.wearidx,
        ...wear.toJSON()
      });
    } else {
      res.status(404).json({ error: 'Wear not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/wears', async (req, res) => {
  try {
    const wear = await Wear.create(req.body);
    res.status(201).json({
      id: wear.wearidx,
      ...wear.toJSON()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/wears/:id', async (req, res) => {
  try {
    const wear = await Wear.findByPk(req.params.id);
    if (wear) {
      await wear.update(req.body);
      res.json({
        id: wear.wearidx,
        ...wear.toJSON()
      });
    } else {
      res.status(404).json({ error: 'Wear not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/wears/:id', async (req, res) => {
  try {
    const wear = await Wear.findByPk(req.params.id);
    if (wear) {
      await wear.destroy();
      res.json({ message: 'Wear deleted successfully' });
    } else {
      res.status(404).json({ error: 'Wear not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User CRUD operations
app.get('/api/users', async (req, res) => {
  try {
    const { _sort = 'useridx', _order = 'ASC' } = req.query;

    const users = await User.findAll({
      order: [[_sort, _order]]
    });

    const mappedUsers = users.map(user => ({
      id: user.useridx,
      ...user.toJSON()
    }));

    const count = users.length;

    res.set('Content-Range', `users 0-${count}/${count}`);
    res.set('X-Total-Count', count.toString());
    res.json(mappedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json({
        id: user.useridx,
        ...user.toJSON()
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      id: user.useridx,
      ...user.toJSON()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json({
        id: user.useridx,
        ...user.toJSON()
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const t = await sequelize.transaction();
    try {
      // 먼저 purchase_list에서 해당 사용자의 구매 기록을 삭제
      await PurchaseList.destroy({
        where: { useridx: req.params.id },
        transaction: t
      });
      // 그 다음 사용자 삭제
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.destroy({ transaction: t });
        await t.commit();
        res.json({ message: 'User deleted successfully' });
      } else {
        await t.rollback();
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// 구매 목록 API
// 관리자용 구매 목록 API
// Purchase List CRUD operations
app.get('/api/buy', async (req, res) => {
  try {
    const { _sort = 'purchase_idx', _order = 'ASC' } = req.query;

    const purchases = await PurchaseList.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'userid']
        },
        {
          model: Wear,
          attributes: ['w_name', 'w_brand', 'w_price']
        }
      ],
      order: [[_sort, _order]]
    });

    const mappedPurchases = purchases.map(purchase => ({
      id: purchase.purchase_idx,
      ...purchase.toJSON(),
      username: purchase.User.username,
      user_email: purchase.User.userid,
      product_name: purchase.Wear.w_name,
      product_brand: purchase.Wear.w_brand,
      product_price: purchase.Wear.w_price
    }));

    const count = purchases.length;
    
    res.set('Content-Range', `purchases 0-${count}/${count}`);
    res.set('X-Total-Count', count.toString());
    res.json(mappedPurchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/buy/:id', async (req, res) => {
  try {
    const purchase = await PurchaseList.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username', 'userid']
        },
        {
          model: Wear,
          attributes: ['w_name', 'w_brand', 'w_price']
        }
      ]
    });
    
    if (purchase) {
      res.json({
        id: purchase.purchase_idx,
        ...purchase.toJSON(),
        username: purchase.User.username,
        user_email: purchase.User.userid,
        product_name: purchase.Wear.w_name,
        product_brand: purchase.Wear.w_brand,
        product_price: purchase.Wear.w_price
      });
    } else {
      res.status(404).json({ error: 'Purchase not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/test-purchases', async (req, res) => {
  try {
    const purchases = await PurchaseList.findAll();
    res.json(purchases);
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 인증 코드 생성 및 이메일 전송
app.post('/api/verification/send', async (req, res) => {
  try {
    const { email } = req.body;

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationCode.create({
      email,
      code: verificationCode,
      expires_at: expiresAt,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '포인트 충전 인증번호',
      text: `인증번호: ${verificationCode}\n이 인증번호는 10분간 유효합니다.`,
      html: `
        <h2>포인트 충전 인증번호</h2>
        <p>인증번호: <strong>${verificationCode}</strong></p>
        <p>이 인증번호는 10분간 유효합니다.</p>
      `,
    });

    res.json({ message: '인증번호가 전송되었습니다.' });
  } catch (error) {
    console.error('인증번호 전송 실패:', error);
    res.status(500).json({ message: '인증번호 전송에 실패했습니다.' });
  }
});

// 인증번호 확인
app.post('/api/verification/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    const verification = await VerificationCode.findOne({
      where: {
        email,
        code,
        expires_at: { [Op.gt]: new Date() },
        is_verified: false,
      },
      order: [['created_at', 'DESC']],
    });

    if (!verification) {
      return res.status(400).json({ message: '유효하지 않거나 만료된 인증번호입니다.' });
    }

    await verification.update({ is_verified: true });
    res.json({ message: '인증이 완료되었습니다.' });
  } catch (error) {
    console.error('인증 실패:', error);
    res.status(500).json({ message: '인증에 실패했습니다.' });
  }
});

// 포인트 충전
app.post('/api/points/charge', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { email, amount } = req.body;
    
    // 금액 제한 체크
    const chargeAmount = parseInt(amount);
    if (chargeAmount <= 0 || chargeAmount > 1000000) {
      return res.status(400).json({ message: '충전 금액은 1원에서 100만원 사이여야 합니다.' });
    }

    console.log('Charging points:', { email, chargeAmount });

    // 인증 확인
    const verification = await VerificationCode.findOne({
      where: {
        email,
        is_verified: true,
        created_at: { [Op.gt]: new Date(Date.now() - 30 * 60 * 1000) }
      },
      order: [['created_at', 'DESC']],
    });

    if (!verification) {
      return res.status(400).json({ message: '인증이 필요합니다.' });
    }

    // 사용자 찾기
    const user = await User.findOne({ 
      where: { userid: email },
      transaction: t
    });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 현재 포인트 값 확인
    const currentPoints = user.points || 0;
    console.log('Current points:', currentPoints);

    // 포인트 업데이트
    await User.update(
      { points: currentPoints + chargeAmount },
      { 
        where: { userid: email },
        transaction: t 
      }
    );

    await t.commit();
    
    console.log('Points updated successfully:', {
      before: currentPoints,
      charged: chargeAmount,
      after: currentPoints + chargeAmount
    });

    res.json({ 
      message: '포인트가 충전되었습니다.',
      points: currentPoints + chargeAmount 
    });

  } catch (error) {
    await t.rollback();
    console.error('포인트 충전 실패:', error);
    res.status(500).json({ message: '포인트 충전에 실패했습니다.' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: '검색어를 입력해주세요.' });
    }

    const products = await Wear.findAll({
      where: {
        w_name: {
          [Op.like]: `%${q}%`
        }
      },
      attributes: [
        'wearidx', 'w_name', 'w_brand', 'w_price', 'w_path', 'w_code', 'w_gender'
      ]
    });

    res.json(products);
  } catch (error) {
    console.error('검색 실패:', error);
    res.status(500).json({ message: '검색 중 오류가 발생했습니다.' });
  }
});