const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ 
      where: { useridx: decoded.id, isAdmin: true }
    });

    if (!user) {
      return res.status(403).json({ message: '관리자 권한이 없습니다.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않은 접근입니다.' });
  }
};

module.exports = adminAuth;