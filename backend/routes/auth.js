const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/kakao', async (req, res) => {
  try {
    const { code } = req.body;
    
    // 카카오 액세스 토큰 얻기
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
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
    let user = await User.findOne({ where: { kakao_id: kakaoUser.id } });
    if (!user) {
      user = await User.create({
        kakao_id: kakaoUser.id,
        userid: `kakao_${kakaoUser.id}`,
        username: kakaoUser.properties.nickname,
        social_type: 'kakao',
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.useridx, email: user.userid, loginType: 'kakao' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.useridx, name: user.username, email: user.userid } });
  } catch (error) {
    console.error('Kakao login error:', error);
    res.status(500).json({ message: '카카오 로그인 실패', error: error.message });
  }
});

module.exports = router;