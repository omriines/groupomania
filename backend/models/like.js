'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
   
     static associate(models) {

      models.Like.belongsTo(models.Post, { foreignKey: {allowNull: false}})
    
      models.Like.belongsTo(models.User,{ foreignKey: {allowNull: false}})
    }
  }
  Like.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });

  
  return Like;
};