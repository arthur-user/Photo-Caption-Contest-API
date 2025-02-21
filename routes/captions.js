const express = require('express');
const router = express.Router();
const authorization = require('../middleware/authorization');

const captionService = require('../services/caption-service');

/**
 * @swagger
 * /captions/{id}:
 *    get:
 *      summary: Get a single caption
 *      produces:
 *        - application/json
 *      tags:
 *        - Captions
 *      parameters:
 *        - name: id
 *          description: caption id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 4
 *      responses:
 *        "200":
 *          description: returns caption
 *          scheme:
 *            $ref: '#/components/schemas/Captions'
 *        "404":
 *          description: Requested user not found 
 *  */ 
router.get('/:id', captionService.getById);


/**
 * @swagger
 * /captions:
 *     post:
 *       summary: Create a new caption
 *       produces:
 *         - application/json
 *       tags:
 *         - Captions
 *       security:
 *         - ApiKeyAuth: []
 *       requestBody:
 *         description: Data for a new caption
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caption'
 *       response:
 *         "201":
 *           description: returns a created caption
 *           schema:
 *             $ref: '#/components/schemas/Caption'
 *         "401":
 *           description: User is not properly authenticated
 */
router.post('/', authorization, captionService.add);

/**
 * @swagger
 * /captions/{id}:
 *     put:
 *       summary: Update caption comment
 *       produces:
 *         - application/json
 *       tags:
 *         - Captions
 *       security:
 *         - ApiKeyAuth: []
 *       parameters:
 *         - name: id
 *           description: caption id to be updated
 *           in: path
 *           type: integer
 *           required: true
 *           example: 4
 *       requestBody:
 *         description: Updated comment
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   type: string
 *                   example: Great picture!
 *       responses:
 *         "201":
 *           description: returns an updated caption
 *           schema:
 *             $ref: '#/components/schemas/Caption'
 *         "401":
 *           description: User is not properly authenticated
 *         "403":
 *           description: User does not have satisfactory authorization to update this caption
 *         "404":
 *           description: requested caption not found
 */
router.put('/:id', authorization, captionService.update);

/**
 * @swagger
 * /captions/{id}:
 *     delete:
 *       summary: Delete a caption
 *       produces:
 *         - application/json
 *       tags:
 *         - Captions
 *       security:
 *         - ApiKeyAuth: []
 *       parameters:
 *         - name: id
 *           description: caption id to be deleted
 *           in: path
 *           type: integer
 *           required: true
 *           example: 4
 *       responses:
 *         "201":
 *           description: caption deleted
 *         "401":
 *           description: User not properly authenticated
 *         "403":
 *           description: User not properly authorized to delete this caption
 *         "404":
 *           description: requested caption not found
 */
router.delete('/:id', authorization, captionService.delete);

module.exports = router;
