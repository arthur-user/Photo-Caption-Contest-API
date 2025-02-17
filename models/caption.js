'use strict';

/**
 * @swagger
 * components:
 *     schemas:
 *       Caption:
 *         type: object
 *         required:
 *           - photo_id
 *           - user_id
 *           - comment
 *         properties:
 *           photo_id:
 *             type: integer
 *             description: Foreign key of the image this comment is captionining (references `Image` model)
 *           user_id:
 *             type: integer
 *             description: Foreign key of the user who made the comment (references `User` model)
 *           comment:
 *             type: string
 *             description: Caption regarding the image
 *         example:
 *           photo_id: 2
 *           user_id: 1
 *           comment: This is a great image!
 */
 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Caption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Caption.belongsTo(models.Image, {
        foreignKey: 'photo_id',
        as: 'photo'
      });
      Caption.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      })
      }
    }
  
  Caption.init({
    photo_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Caption',
  });
  return Caption;
};