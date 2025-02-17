'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const jwt = require('jsonwebtoken');

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Unique email for the user
 *          password:
 *            type: string
 *            description: Password must be between 8 and 20 characters
 *        example:
 *          name: Test User
 *          email: testuser@test.com
 *          password: passw0rd
 */


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Caption, {
        foreignKey: 'user_id',
        as: 'captions'
      });
    }
  

    generateToken() {
      return jwt.sign({
        id: this.id,
        email: this.email
        },
        config.privateKey, {expiresIn: '1h'}); //expires in 1h
      }  
    }


  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true
    },
    password: {
     type: DataTypes.STRING,
      allowNull: false, //ensure password is required in Sequelize
      len: [8, 20]
  }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};