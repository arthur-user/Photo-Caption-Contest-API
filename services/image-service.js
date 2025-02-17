const CacheService = require('./cache-service');
const cache = new CacheService(900); // cache 15 minutes
const CACHE_KEY = 'image';

const Image = require('../models').Image;
const Caption = require('../models').Caption;

module.exports = {
    list(req,res) {
        return Image
        .findAll({
            order: [
                ['createdAt', 'ASC'],
            ]
        })
        .then((image) => res.status(200).send(image))
        .catch((error)=> {
            console.error(error);
            res.status(400).send( {message: 'An error occurred during transaction'});
        });
    },

    getById(req,res){
        return cache.get(`${CACHE_KEY}_${req.params.id}`, () => Image
    .findByPk(req.params.id, {// Use findByPk instead of findByPK for Sequelize’s method to find by primary key.
        include: [{
            model: Caption,
            as: 'captions'
        }],
    }))
    .then((image) => {
        if(!image){
            return res.status(404).send({
                message: 'Not found',
            });
        }
        return res.status(200).send(image);
    })
    .catch((error)=>{
        console.error(error); //better than console.log for logging errors
        res.status(400).send({ message: 'An error occurred during transaction'});
    });
    },


    add(req,res){
        return Image
        .create({
            name: req.body.name,
            url: req.body.url,
            citation: req.body.citation
        })
        .then((image)=>res.status(201).send(image))
        .catch((error)=> {
            console.error(error);
            res.status(400).send( {message: 'An error occurred during transaction'});
        });
    },

    update(req,res){
        return Image
        .findByPk(req.params.id)
        .then(image => {
            if (!image){
                return res.status(404).send({
                    message: 'Not found',
                });
            }
            return image
            .update({
                name: req.body.name || image.name,
                url: req.body.url || image.url,
                citation: req.body.citation || image.citation
            })
            .then(() => cache.delete(`${CACHE_KEY}_${req.params.id}`))
            .then(() => res.status(200).send(image))
            .catch((error)=> res.status(400).send(error));
        })
        .catch((error)=> {
            console.error(error);
            res.status(400).send( {message: 'An error occurred during transaction'});
        });
    },

    delete(req, res){
        return Image
        .findByPk(req.params.id)
        .then(image => {
            if(!image){
                return res.status(400).send({
                    message: 'Image not found',
                });
            }
            return image
            .destroy()
            .then(() => cache.delete(`${CACHE_KEY}_${req.params.id}`))
            .then(() => res.status(204).send())
            .catch((error)=> {
                console.error(error);
                res.status(400).send( {message: 'An error occurred during transaction'});
            });
        })
        .catch((error)=> {
            console.error(error);
            res.status(400).send( {message: 'An error occurred during transaction'});
        });
    },
};