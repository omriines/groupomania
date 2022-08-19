'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.Post)
    }
    static associate(models) {
      models.User.hasMany(models.Like)
      
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: {
      type:DataTypes.STRING,
      unique: true},
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
 
  return User;
};