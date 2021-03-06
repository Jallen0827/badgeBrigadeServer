//REQUIRED PACKAGES
const router = require('express').Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

//MODELS/MIDDLEWARE
const Profile = require('../db').import('../models/profile.js');
const User = require('../db').import('../models/user.js');
const validateSession = require('../middleware/validate-session');

//DB ASSOCIATIONS
// User.belongsTo(Profile);

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



//UPDATE PROFILE
router.put('/update/:id', validateSession, upload.single('file'), (req,res)=>{
    Profile.update({
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
    Profile.destroy({where: {id: req.params.id}})
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).json({msg: err})
    })
})

module.exports = router