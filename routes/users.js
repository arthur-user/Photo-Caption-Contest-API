const express = require('express');
const router = express.Router();
const authorization = require('../middleware/authorization');

const userService = require('../services/user-service');

/**
 * @swagger
 * /users:
 *    get:
 *      summary: Get all users
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      responses:
 *        "200":
 *          description: Returns a list of all users from the database
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 */
router.get('/', userService.list);

/**
 * @swagger
 * /users/{id}:
 *    get:
 *      summary: Get a single user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      parameters:
 *        - name: id 
 *          description: user id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: Returns a single user and their captions
 *          schema:
 *            $ref: '#/components/schemas/User'
 *        "404":
 *          description: Requested user not found
 */
router.get('/:id', userService.getById);

/**
 * @swagger
 * /users:
 *    post:
 *      summary: Create a new user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      requestBody:
 *        description: Data for a new user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "201":
 *          description: Returns the new user
 *          schema:
 *            $ref: '#/components/schemas/User'
 */
router.post('/', userService.create);

/** 
 * @swagger
 * /users/login:
 *    post:
 *      summary: Login in order to retrieve the user's access token
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      requestBody:
 *        description: User data for a new user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: testuser@test.com
 *                password:
 *                  type: string
 *                  example: p@ssw0rd
 *      responses:
 *        "200":
 *           description: Logs in specific user and returns an access token
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               token:
 *                 type: string
 *                 description: auth token which is required for authenticated actions
 *        "401":
 *           description: Provided username or password is incorrect
 * 
 */      
router.post('/login', userService.login);

/**
 * @swagger
 * /users/{id}:
 *     put:
 *       summary: Updated a specific user's username or password
 *       produces:
 *         - application/json
 *       tags:
 *         - Users
 *       security:
 *         - ApiKeyAuth: []
 *       parameters:
 *         - name: id
 *           description: user id
 *           in: path
 *           type: integer
 *           required: true
 *           example: 1
 *       requestBody:
 *         description: Updated specified user data
 *         required: true
 *         content:
 *           - application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: testuser@test.com
 *                 password:
 *                   type: string
 *                   example: p@ssw0rd
 *       responses:
 *         "201":
 *           description: returns the updated user
 *           schema:
 *             $ref: '#/components/schemas/User'
 *         "401":
 *           description: Lacking necessary authenticated credentials
 *         "403":
 *           description: Lacking necessary authorization
 *         "404":
 *           description: Requested user not found
 */
router.put('/:id', authorization, userService.update);

module.exports = router;