'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {

    static associate(models) {
      models.Post.hasMany(models.Like)
      models.Post.hasMany(models.Like,{as:'likeCount'})
      models.Post.belongsTo(models.User, {foreignKey: {allowNull: false}});
    }
  }
  Post.init({
    message: DataTypes.STRING,
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};