const express = require('express');
const router = express.Router();

const imageService = require('../services/image-service');

/**
 * @swagger
 * /images:
 *    get:
 *      summary: Get all images
 *      produces:
 *        - application/json
 *      tags:
 *        - Images
 *      responses:
 *        "200":
 *          description: Returns a list of all images
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Image'
 */
router.get('/', imageService.list);

/**
 * @swagger
 * /images/{id}:
 *    get:
 *      summary: Get a single image with captions
 *      produces:
 *        - application/json
 *      tags:
 *        - Images
 *      parameters:
 *        - name: id
 *          description: image id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 4
 *      responses:
 *        "200":
 *          description: Returns an image with its captions
 *          schema:
 *            $ref: '#/components/schemas/Image'
 *        "404":
 *          description: Image not found
 */
router.get('/:id', imageService.getById);

/**
 * @swagger
 * /images:
 *    post:
 *      summary: Creates a new image
 *      produces:
 *        - application/json
 *      tags:
 *        - Images
 *      requestBody:
 *        description: Data for new image
 *        required: true
 *        content:
 *          application/json:
 *          schema:
 *          $ref: '#/components/schemas/Image'
 *      responses:
 *        "201":
 *          description: Returns the created image
 *          schema:
 *            $ref: '#/components/schemas/Image'
 */
router.post('/', imageService.add);

/**
 * @swagger
 * /images/{id}:
 *    put:
 *      summary: Updates an image
 *      produces:
 *        - application/json
 *      tags:
 *        - Images
 *      parameters:
 *        - name: id
 *          description: image id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 4
 *      requestBody:
 *       description: Data for updated image
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Animal picture
 *               url:
 *                 type: string
 *                 description: url path to the image
 *                 example: https://www.example.com/image.jpg
 *               citation:
 *                 type: string
 *                 example: Creative Commons Attribution 4.0
 *      responses:
 *        "201":
 *          description: Returns the updated image
 *          schema:
 *            $ref: '#/components/schemas/Image'
 *        "404":
 *          description: Image not found
 */
router.put('/:id', imageService.update);

/**
 * @swagger
 * /images/{id}:
 *    delete:
 *      summary: Deletes an image
 *      produces:
 *        - application/json
 *      tags:
 *        - Images
 *      parameters:
 *        - name: id
 *          description: image id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 4
 *      responses:
 *        "204":
 *          description: Image successfully deleted
 *        "404":
 *          description: Requested image not found
 */
router.delete('/:id', imageService.delete);

module.exports = router;
