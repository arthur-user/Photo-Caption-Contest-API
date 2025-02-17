const jwt = require("jsonwebtoken");

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env]; //dynamically access env config within file

module.exports = function(req, res, next){
    const token = req.headers["authorization"];

    if(!token) return res.status(401).send("Token not provided. Access denied.");


    try {
        req.user = jwt.verify(token, config.privateKey);
        next();
    } catch (authError) {
        console.error('Authorization error:', authError);
        res.status(400).send("Token invalid.");
    }
};


