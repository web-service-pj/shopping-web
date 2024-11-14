const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const User = sequelize.define('User', {
  useridx: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userid: {
    type: DataTypes.STRING(300),
    allowNull: true,
    unique: true,
  },
  userpw: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  usergender: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0,
  },
  userphone: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  useraddress: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  userregdate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  kakao_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  social_type: {
    type: DataTypes.ENUM('local', 'kakao'),
    defaultValue: 'local',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'shop_user',
  timestamps: false,
});

module.exports = User;