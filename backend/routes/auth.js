const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/kakao', async (req, res) => {
  try {
    const { code } = req.body;
    
    console.log('Received code:', code);
    
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code,
      },
    });

    console.log('Token response:', tokenResponse.data);

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log('Kakao user data:', userResponse.data);

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

    const token = jwt.sign(
      { id: user.useridx, email: user.userid, loginType: 'kakao', isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
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

module.exports = router;