//REQUIRED PACKAGES
const router = require('express').Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

//MODELS/MIDDLEWARE
const Profiles = require('../db').import('../models/profile.js')

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

//GETALLSTUDENTS
router.get('/getAllstudents', (req,res)=>{
    Profiles.findall({where:{role: 'student'}})
    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(401).send({msg: err})
    })
})

//CREATE PROFILE
router.post('/create', upload.single('file'), (req,res)=>{
    Profiles.create({
        picture_link: req.file.location,
        portfolio_link: req.body.portfolio,
        about_me: req.body.aboutMe,
        skills: req.body.skills,
        hired: req.body.hired,
    })
    .then(successData => res.status(200).json({ successData }))
    .catch(err => {
        res.status(500).json({ error: err })
        console.log(err);
    })
})

//UPDATE PROFILE
router.put('/update/:id', upload.single('file'), (req,res)=>{
    console.log(req.body);
    Profiles.update({
        picture_link: req.file.location,
        portfolio_link: req.body.portfolio,
        about_me: req.body.aboutMe,
        skills: req.body.skills,
        hired: req.body.hired,
    }, {where: {id: req.params.id}})
    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).send({msg: err})
    })
})


//DELETE PROFILE
router.delete('/delete/:id', (req,res)=>{
    Profiles.destroy({where: {id: req.params.id}})
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).json({msg: err})
    })
})

module.exports = router