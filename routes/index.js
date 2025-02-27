const express = require('express');
const router = express.Router();
const swagger = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info: {
            title: "Caption Contest API",
            version: "1.0.0",
            description:
              "API implementing authentication and authorization which allows users to add, update and delete captions to photos.",
            license: {
              name: "MIT",
              url: "https://opensource.org/license/mit"
            } 
        }
    },
    apis: [
        './models/photo.js',        // model files are conventionally singular in Sequelize
        './models/user.js',
        './models/caption.js',
        './routes/index.js',
        './routes/users.js',        // route files are conventionally plural in Express.js
        './routes/photos.js',
        './routes/captions.js'
    ]
};
const specs = swagger(swaggerOptions);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express '});
});

router.use("/docs", swaggerUi.serve);
router.get(
    "/docs",
    swaggerUi.setup(specs, {
        explorer: true
    })
);

/**
 * @swagger
 * components:
 *    securitySchemes:
 *       ApiKeyAuth:
 *        type: apiKey
 *        in: header
 *        name: authorization
 */

module.exports = router;