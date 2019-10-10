const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session');

//SIGNUP
router.post('/signup', (req,res)=>{
    User.create({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 10),
        role: req.body.user.role
    }).then((user)=>{
        let token = jwt.sign({id:user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
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
                    let token = jwt.sign({id:user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
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

// UPDATE USER
router.put('/update/:id', validateSession, (req,res)=>{
    User.update({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 10),
        role: req.body.user.role
    }, {where: {id: req.params.id}})
    .then(data =>{
        res.status(200).json(`${req.body.user.firstName} successfully updated.`)
    })
    .catch(err=>{
        res.status(500).send({msg: err})
    })
})

// DELETE USER
router.delete('/delete/:id', validateSession, (req,res)=>{
    User.destroy({where: {id: req.params.id}})
    .then(data=>{
        res.status(200).json(`${req.params.id} successfully updated.`)
    })
    .catch(err=>{
        res.status(500).json({msg: err})
    })
})


module.exports = router;