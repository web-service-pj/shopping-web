const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Wear = require('./wear');

class ShoppingCart extends Model {}

ShoppingCart.init({
  cart_idx: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  wearidx: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  w_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  w_gender: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  added_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'ShoppingCart',
  tableName: 'shopping_cart',
  timestamps: false
});

// 관계 설정
ShoppingCart.belongsTo(Wear, { foreignKey: 'wearidx', targetKey: 'wearidx' });
Wear.hasMany(ShoppingCart, { foreignKey: 'wearidx', sourceKey: 'wearidx' });

module.exports = ShoppingCart;
