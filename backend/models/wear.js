const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wear = sequelize.define('Wear', {
  wearidx: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  w_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  w_brand: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  w_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  w_size: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  w_code: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  w_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  w_volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  w_category: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  w_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  w_gender: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
  },
  w_stock: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'shop_wear',
  timestamps: false,
});

module.exports = Wear;