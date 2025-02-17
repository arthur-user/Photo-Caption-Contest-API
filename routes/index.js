const express = require('express');
const router = express.Router();
const swagger = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

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
        './models/images.js',
        './models/users.js',
        './models/captions.js',
        './routes/index.js',
        './routes/users.js',
        './routes/images.js',
        './routes/captions.js'
    ]
};
const specs = swagger(swaggerOptions);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express '});
});

router.use("docs", swaggerUi.serve);
router.get(
    "/docs",
    swaggerUI.setup(specs, {
        explorer: true
    })
);

/**
 * @swagger
 * components:
 *     securitySchemas:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: authorization
 */

module.exports = router;