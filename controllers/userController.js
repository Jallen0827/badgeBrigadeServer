//REQUIRED PACKAGES
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

//MODELS AND MIDDLEWARE
const User = require('../db').import('../models/user.js');
const validateSession = require('../middleware/validate-session');

//SETUP S3
let s3 = new AWS.S3({
    accessKeyId:  process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
})

//SETUP MULTER STORAGE LOCATION
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ja-s3-aws-bucket',
        acl:'public-read-write',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

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
router.put('/update/:id', validateSession, upload.single('file'), (req,res)=>{
    User.update({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 10),
        role: req.body.user.role,
        picture_link: req.file.location,
        portfolio_link: req.body.portfolio,
        about_me: req.body.aboutMe,
        skills: req.body.skills,
        hired: req.body.hired
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

// Get User and Profile
router.get('/getprofile', validateSession, (req, res) => {
    console.log(req.user.id)
    User.findOne({
        where: {
            id: req.user.id
        },
        include: 'profile'
    })
        .then(function creatSuccess(data) {
            res.status(200).json({
                data: data
            })
        }).catch(err => res.status(500).json(err))
})


module.exports = router;