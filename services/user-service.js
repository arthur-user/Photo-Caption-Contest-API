const CacheService = require('./cache-service');
const cache = new CacheService(900); // cache 15 minutes
const CACHE_KEY = 'user';

const User = require('../models').User;
const Caption = require('../models').Caption;

const bcrypt = require('bcrypt');
const saltRounds = 11;

module.exports = {
    list(req, res){
        return User
        .findAll({
         order: [
            ['id','ASC'],
         ],
         attributes: ['id', 'name', 'email'] 
        })
        .then((users) => res.status(200).send(users))
        .catch((error) => {
            console.error(error);
            res.status(400).send( { message: 'An error occurred during transaction'});
        });
    },

    getById(req,res){
        return cache.get(`${CACHE_KEY}_${req.params.id}`, () => User
         .findByPk(req.params.id, {
            include: [{
                model: Caption,
                as: 'captions'
            }],
            attributes: ['id', 'name', 'email']
         }))
         .then((user) => {
            if(!user){
                return res.status(404).send({
                    message: 'Requested user not found',
                });
            }
            return res.status(200).send(user);
         })
         .catch((error) => {
            console.error(error);
            res.status(400).send({ message: 'An error occurred during transaction'});
         });
    },

    create(req,res){
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            return User
            .create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            })
            .then((user)=>res.status(201).send({
                id: user.id,
                name: user.name,
                email: user.email
            }))
            .catch((error)=>{
                console.error(error);
                res.status(400).send({ message: 'An error occurred during transaction'});
            });
        })
    },


    login(req, res){
        const user = User
        .findOne({
            where: {
                email: req.body.email
            }
        })
        .then((user)=>{
            if(!user){
                return res.status(400).send({
                    message: 'Provided username or password is incorrect'
                });
            }

            bcrypt.compare(req.body.password, user.password, function (err, result){
                if (result){
                    const token = user.generateToken();
                    return res.header("authorization", token).status(200).send({
                     id: user.id,
                     name: user.name,
                     email: user.email,
                     token: token
                    });
                } else {
                    return res.status(401).send({
                        message: 'Provided username or password is incorrect'
                    });
                }
            });
        })
        .catch((error)=>{
            console.error(error);
            res.status(400).send({ message: 'An error occurred during transaction'});
        });
    },

    update (req, res){
        if (req.user.id.toString() !== req.params.id){
            return res.status(403).send({
                message: 'Authorization lacking/not sufficient to update this user'
            });
        }

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        return User
        .findByPk(req.params.id)
        .then(user => {
            if(!user){
                return res.status(404).send({
                    message: 'Requested user not found'
                });
            }
            return user
            .update({
                name: req.body.name || user.name,
                password: req.body.hash || user.password
            })
            .then(() => cache.delete(`${CACHE_KEY}_${req.params.id}`))
            .then(() => res.status(200).send({
                id: user.id,
                name: user.name,
                email: user.email
            }))
            .catch((error)=>{
                console.error(error);
                res.status(400).send({ message: 'An error occurred during transaction'});
            });
        })
        .catch((error)=>{                                                           //different .catch() to handle different promise chains
            console.error(error);
            res.status(400).send({ message: 'An error occurred during transaction'});
        });
    });
    },

    delete(req, res){
        return User
        .findByPk(req.params.id)
        .then(user => {
            if (!user){
                return res.status(400).send({
                    message: 'Requested user not found',
                });
            }
            return user
            .destroy()
            .then(() => cache.delete(`${CACHE_KEY}_${req.params.id}`))
            .then(() => res.status(204).send())
            .catch((error) => {
                console.error(error);
                res.status(400).send({ message: 'An error occurred during transaction'});
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).send({ message: 'An error occurred during transaction'});
        });
    },
};


