const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShoppingCart = sequelize.define('ShoppingCart', {
  cart_idx: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
  wearidx: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  w_code: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  w_gender: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  added_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'shopping_cart',
  timestamps: false
});

module.exports = ShoppingCart;