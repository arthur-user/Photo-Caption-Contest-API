const CacheService = require('./cache-service');
const cache = new CacheService(1800); // cache 30 minutes
const CACHE_KEY = 'caption';

const Photo = require('../models').Photo;
const Caption = require('../models').Caption;
const User = require('../models').User;

module.exports = {
    getById(req, res) { //.get method of the CacheService module
        return cache.get(`${CACHE_KEY}_${req.params.id}`, () => 
            Caption.findByPk(req.params.id, {
                include: [
                    {
                        model: Photo,
                        as: 'photo'
                    },
                    {
                        model: User,
                        as: 'user'
                    }
                ]
            })
        )
        .then((caption) => {
            if (!caption) {
                return res.status(404).send({
                    message: 'Caption not present',
                });
            }
            return res.status(200).send(caption);
        })
        .catch((error) => {
            console.error(error);
            res.status(400).send({ message: 'An error occurred during transaction' });
        });
    },

    add(req, res) {
        const userId = req.user.id;
        return Caption
            .create({
                photo_id: req.body.photo_id,
                user_id: userId,
                comment: req.body.comment
            })
            .then((caption) => res.status(201).send(caption))
            .catch((error) => {
                console.error(error);
                res.status(400).send({ message: 'An error occurred during transaction' });
            });
    },

    update(req, res) {
        return Caption
            .findByPk(req.params.id)
            .then((caption) => {
                if (!caption) {
                    return res.status(404).send({
                        message: 'Requested caption not found',
                    });
                }
                if (caption.user_id !== req.user.id) {
                    return res.status(403).send({
                        message: 'User has unauthorized/lacking permissions'
                    });
                }

                return caption
                    .update({
                        comment: req.body.comment || caption.comment
                    })
                    .then(() => cache.delete(`${CACHE_KEY}_${req.params.id}`))
                    .then(() => res.status(200).send(caption))
                    .catch((error) => {
                        console.error(error);
                        res.status(400).send({ message: 'An error occurred during transaction' });
                    });
            });
    },

    delete(req, res){
        return Caption
        .findByPk(req.params.id)
        .then(caption => {
            if(!caption){
                return res.status(400).send({
                    message: 'Requested caption not found',
                });
            }
            if (caption.user_id !== req.user.id){
                return res.status(403).send({
                    message: 'User has unauthorized/lacking permissions'
                })
            }
            return caption
            .destroy()
            .then(() => cache.delete(`${CACHE_KEY}_${req.params.id}`))
            .then(() => res.status(204).send())
            .catch((error) => {
                console.error(error);
                res.status(400).send({ message: 'An error occurred during transaction'});
            });
        });
    },
};
