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
    allowNull: false,
    unique: true,
  },
  userpw: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  usergender: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
  },
  userphone: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  useraddress: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  userregdate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'shop_user',
  timestamps: false,
});

module.exports = User;