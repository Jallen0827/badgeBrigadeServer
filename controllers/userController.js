const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//SIGNUP
router.post('/signup', (req,res)=>{
    User.create({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 10),
        role: req.body.user.role
    }).then((user)=>{
        let token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
        res.status(200).json({
            user: user,
            sessionToken: token
        })
    }).catch((err)=>{
        res.status(401).send({error: 'failed create user', msg: err})
    })
})

//SIGNIN
router.post('/signin', (req,res)=>{
    User.findOne({
        where:{
            email: req.body.user.email
        }
    }).then((user)=>{
        if(user){
            bcrypt.compare(req.body.user.password, user.password, (err,matches)=>{
                if(matches){
                    let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
                    res.status(200).json({
                        user: user,
                        sessionToken: token
                    })
                }else{
                    res.status(502).send({error: err, msg: 'bad gateway'})
                }
            })
        }else{
            res.status(500).send({error: 'Failed to authenticate'})
        }
    }, err => res.status(501).send({error: 'Failed to process'}))
})


module.exports = router;