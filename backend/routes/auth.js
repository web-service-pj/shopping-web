const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const KAKAO_CLIENT_ID = 'bdefbf8f8e8a3420efdacb22f0fdc63e';
const KAKAO_REDIRECT_URI = 'https://trendcore.store/oauth/kakao/callback';
const JWT_SECRET = 'xptmxmxptmxm';

router.post('/kakao', async (req, res) => {
  try {
    const { code } = req.body;
    
    // 카카오 액세스 토큰 얻기
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // 카카오 사용자 정보 얻기
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const kakaoUser = userResponse.data;

    // 사용자 찾기 또는 생성
    let user = await User.findOne({ where: { kakao_id: kakaoUser.id.toString() } });
    if (!user) {
      user = await User.create({
        kakao_id: kakaoUser.id.toString(),
        userid: kakaoUser.kakao_account.email || `kakao_${kakaoUser.id}@kakao.com`,
        userpw: 'KAKAO_LOGIN',  // 카카오 로그인 사용자용 기본 비밀번호 설정
        username: kakaoUser.properties.nickname || '카카오 사용자',
        social_type: 'kakao',
        usergender: 0,  // 기본값 설정
        userphone: '',          // 빈 문자열로 기본값 설정
        useraddress: '',
        userregdate: new Date()
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.useridx, email: user.userid, loginType: 'kakao', isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.useridx, name: user.username, email: user.userid, isAdmin: user.isAdmin  } });
  } catch (error) {
    console.error('카카오 로그인 에러:', error.response?.data || error.message);
    res.status(500).json({ 
      message: '카카오 로그인 실패', 
      error: error.message,
      details: error.response?.data 
    });
  }
});

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userid:
 *           type: string
 *         username:
 *           type: string
 *         usergender:
 *           type: integer
 *         userphone:
 *           type: string
 *         useraddress:
 *           type: string
 *         points:
 *           type: integer
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: 새로운 사용자 등록
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - gender
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       400:
 *         description: 잘못된 입력 데이터
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: 사용자 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     isAdmin:
 *                       type: boolean
 *       400:
 *         description: 로그인 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [Users]
 *     summary: 현재 로그인한 사용자 정보 조회
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 사용자를 찾을 수 없음
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         wearidx:
 *           type: integer
 *         w_name:
 *           type: string
 *         w_brand:
 *           type: string
 *         w_price:
 *           type: integer
 *         w_path:
 *           type: string
 *         w_code:
 *           type: string
 *         w_gender:
 *           type: integer
 *         w_category:
 *           type: string
 *         w_stock:
 *           type: string
 */

/**
 * @swagger
 * /api/men-products:
 *   get:
 *     tags: [Products]
 *     summary: 남성 상품 목록 조회
 *     responses:
 *       200:
 *         description: 남성 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/women-products:
 *   get:
 *     tags: [Products]
 *     summary: 여성 상품 목록 조회
 *     responses:
 *       200:
 *         description: 여성 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     tags: [Products]
 *     summary: 브랜드 목록 조회
 *     responses:
 *       200:
 *         description: 브랜드 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   w_brand:
 *                     type: string
 *                   isNew:
 *                     type: boolean
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/brand-products/{brandName}:
 *   get:
 *     tags: [Products]
 *     summary: 특정 브랜드의 상품 목록 조회
 *     parameters:
 *       - in: path
 *         name: brandName
 *         required: true
 *         schema:
 *           type: string
 *         description: 브랜드 이름
 *     responses:
 *       200:
 *         description: 브랜드 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/products/{productCode}:
 *   get:
 *     tags: [Products]
 *     summary: 개별 상품 정보 조회
 *     parameters:
 *       - in: path
 *         name: productCode
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 코드
 *     responses:
 *       200:
 *         description: 상품 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         cart_idx:
 *           type: integer
 *         userid:
 *           type: string
 *         wearidx:
 *           type: integer
 *         quantity:
 *           type: integer
 *         size:
 *           type: string
 *         added_date:
 *           type: string
 *           format: date-time
 *         wear:
 *           $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/shopping-cart:
 *   get:
 *     tags: [Cart]
 *     summary: 장바구니 목록 조회
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 장바구니 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 *   post:
 *     tags: [Cart]
 *     summary: 장바구니에 상품 추가
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wearidx
 *               - quantity
 *               - size
 *             properties:
 *               wearidx:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               size:
 *                 type: string
 *               w_code:
 *                 type: string
 *               w_gender:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 장바구니 추가 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/shopping-cart/{cartItemId}:
 *   put:
 *     tags: [Cart]
 *     summary: 장바구니 상품 수량 수정
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: 수량 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 장바구니 아이템을 찾을 수 없음
 *   delete:
 *     tags: [Cart]
 *     summary: 장바구니 상품 삭제
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 장바구니 아이템을 찾을 수 없음
 */

/**
 * @swagger
 * /api/shopping-cart/all:
 *   delete:
 *     tags: [Cart]
 *     summary: 장바구니 전체 비우기
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 장바구니 비우기 성공
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Purchase:
 *       type: object
 *       properties:
 *         purchase_idx:
 *           type: integer
 *         useridx:
 *           type: integer
 *         wearidx:
 *           type: integer
 *         order_number:
 *           type: string
 *         recipient_name:
 *           type: string
 *         recipient_phone:
 *           type: string
 *         recipient_address:
 *           type: string
 *         delivery_request:
 *           type: string
 *         purchase_date:
 *           type: string
 *           format: date-time
 *         total_amount:
 *           type: integer
 *         used_point:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [PENDING, SHIPPING, DELIVERED, CANCELED]
 *         size:
 *           type: string
 */

/**
 * @swagger
 * /api/purchase:
 *   post:
 *     tags: [Orders]
 *     summary: 상품 구매
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wearidx
 *               - selectedSize
 *               - recipientName
 *               - recipientPhone
 *               - recipientAddress
 *               - totalAmount
 *             properties:
 *               wearidx:
 *                 type: integer
 *               selectedSize:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
 *               recipientName:
 *                 type: string
 *               recipientPhone:
 *                 type: string
 *               recipientAddress:
 *                 type: string
 *               deliveryRequest:
 *                 type: string
 *               totalAmount:
 *                 type: integer
 *               usedPoint:
 *                 type: integer
 *               isCartPurchase:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: 구매 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderNumber:
 *                   type: string
 *                 purchase:
 *                   $ref: '#/components/schemas/Purchase'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/purchases:
 *   get:
 *     tags: [Orders]
 *     summary: 구매 내역 조회
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 구매 내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Purchase'
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/purchases/{orderNumber}:
 *   get:
 *     tags: [Orders]
 *     summary: 단일 구매 내역 조회
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 구매 내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 주문을 찾을 수 없음
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VerificationCode:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         code:
 *           type: string
 *         expires_at:
 *           type: string
 *           format: date-time
 *         is_verified:
 *           type: boolean
 */

/**
 * @swagger
 * /api/verification/send:
 *   post:
 *     tags: [Points]
 *     summary: 포인트 충전을 위한 인증 코드 전송
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: 인증 코드 전송 성공
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/verification/verify:
 *   post:
 *     tags: [Points]
 *     summary: 인증 코드 확인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: 인증 성공
 *       400:
 *         description: 잘못된 인증 코드
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/points/charge:
 *   post:
 *     tags: [Points]
 *     summary: 포인트 충전
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - amount
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               amount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1000000
 *     responses:
 *       200:
 *         description: 포인트 충전 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 points:
 *                   type: integer
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Products]
 *     summary: 상품 검색
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: 검색어
 *     responses:
 *       200:
 *         description: 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: 검색어 누락
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminWear:
 *       allOf:
 *         - $ref: '#/components/schemas/Product'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *     AdminUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userid:
 *           type: string
 *         username:
 *           type: string
 *         usergender:
 *           type: integer
 *         userphone:
 *           type: string
 *         useraddress:
 *           type: string
 *         userregdate:
 *           type: string
 *           format: date-time
 *         isAdmin:
 *           type: boolean
 */

/**
 * @swagger
 * /api/wears:
 *   get:
 *     tags: [Admin]
 *     summary: 모든 상품 목록 조회 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: _sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: _order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         headers:
 *           Content-Range:
 *             schema:
 *               type: string
 *           X-Total-Count:
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminWear'
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음
 *   post:
 *     tags: [Admin]
 *     summary: 새 상품 등록 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: 상품 등록 성공
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음
 */

/**
 * @swagger
 * /api/wears/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: 특정 상품 조회 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminWear'
 *       404:
 *         description: 상품을 찾을 수 없음
 *   put:
 *     tags: [Admin]
 *     summary: 상품 정보 수정 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 *   delete:
 *     tags: [Admin]
 *     summary: 상품 삭제 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 삭제 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Admin]
 *     summary: 모든 사용자 목록 조회 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: _sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: _order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
 *         headers:
 *           Content-Range:
 *             schema:
 *               type: string
 *           X-Total-Count:
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminUser'
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: 특정 사용자 조회 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 사용자 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUser'
 *       404:
 *         description: 사용자를 찾을 수 없음
 *   put:
 *     tags: [Admin]
 *     summary: 사용자 정보 수정 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUser'
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 *   delete:
 *     tags: [Admin]
 *     summary: 사용자 삭제 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 */

/**
 * @swagger
 * /api/buy:
 *   get:
 *     tags: [Admin]
 *     summary: 전체 구매 목록 조회 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: _sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: _order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: 구매 목록 조회 성공
 *         headers:
 *           Content-Range:
 *             schema:
 *               type: string
 *           X-Total-Count:
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   user_email:
 *                     type: string
 *                   product_name:
 *                     type: string
 *                   product_brand:
 *                     type: string
 *                   product_price:
 *                     type: integer
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 권한 없음
 */

/**
 * @swagger
 * /api/buy/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: 특정 구매 내역 조회 (관리자용)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 구매 내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 user_email:
 *                   type: string
 *                 product_name:
 *                   type: string
 *                 product_brand:
 *                   type: string
 *                 product_price:
 *                   type: integer
 *       404:
 *         description: 구매 내역을 찾을 수 없음
 */

module.exports = router;