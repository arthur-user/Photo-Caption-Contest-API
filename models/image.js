'use strict';

/**
 * @swagger
 * components:
 *     schemas:
 *       Image:
 *         type: object
 *         required:
 *           - url
 *           - name
 *         properties:
 *           name:
 *             type: string
 *           url:
 *             type: string
 *             description: Path to the image file
 *           citation:
 *             type: string
 *             description: Citation for the image source
 *         example:
 *          name: Sample Image
 *          url: /images/sample.jpg
 *          citation: by Name Photographer
 * 
 */
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.hasMany(models.Caption, {
        foreignKey: 'photo_id',
        as: 'captions'
      })
    }
  }
  Image.init({
    url: DataTypes.STRING,
    name: DataTypes.STRING,
    citation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};