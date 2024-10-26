const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Wear = require('./wear');

const PurchaseList = sequelize.define('PurchaseList', {
  purchase_idx: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  useridx: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'useridx'
    }
  },
  wearidx: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Wear,
      key: 'wearidx'
    }
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  recipient_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  recipient_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  recipient_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  delivery_request: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  purchase_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total_amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  used_point: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'PENDING'
  },
  size: { 
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'purchase_list',
  timestamps: false
});

// 관계 설정
PurchaseList.belongsTo(User, { foreignKey: 'useridx' });
PurchaseList.belongsTo(Wear, { foreignKey: 'wearidx' });

module.exports = PurchaseList;