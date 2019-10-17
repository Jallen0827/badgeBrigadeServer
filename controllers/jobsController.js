//REQUIRED PACKAGES
const router = require('express').Router()
var sequelize = require('../db');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

//MODELS AND MIDDLEWARE
const User = require('../db').import('../models/user.js');
const Jobs = require('../db').import('../models/jobs.js');
const validateSession = require('../middleware/validate-session');

//DB ASSOCIATIONS
User.hasMany(Jobs);

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


/****************
 *** Get Jobs ***
****************/

// Get All Jobs

router.get('/alljobs', (req, res) => {
    Jobs.findAll()
    .then(job => res.status(200).json(job))
    .catch(err => res.status(500).json({ error: err }))
})

// Get Job by User Id

router.get('/alluserjobs/user', (req, res) => {
    let token = jwt.decode(req.headers.authorization);
    console.log(token)
    Jobs.findAll({
        where: {userId: token.id}
    })
    .then(job => res.status(200).json(job))
    .catch(err => res.status(500).json({ error: err }))
})

// Get Single Job

router.get('/job/:id', (req, res) => {
    Jobs.findOne({
        where:{id: req.params.id} // , owner: req.job.id
    })
    .then(job => res.status(200).json(job))
    .catch(err => res.json({error:err}));
})

/*****************
 *** Post Jobs ***
*****************/

router.post('/create', validateSession, upload.single('file'), (req, res) => {
    console.log(req.user.id)
    Jobs.create({
        job_title: req.body.job_title,
        company_name: req.body.company_name,
        position_summary: req.body.position_summary,
        contact_email: req.body.contact_email,
        where_to_apply: req.body.where_to_apply,
        company_logo: (req.file) ? req.file.location : null,
        userId: req.user.id
    })
    .then(
        createSuccess = job => {
            res.status(200).json(job)
        },
        createFail = job => {
            res.status(500).json({ error: err })
        }
    )
});

/*******************
 *** Update Jobs ***
*******************/

router.put('/:id', validateSession, upload.single('file'), (req, res) => {
    console.log(req.file)
    Jobs.update({
        job_title: req.body.job_title,
        company_name: req.body.company_name,
        position_summary: req.body.position_summary,
        contact_email: req.body.contact_email,
        where_to_apply: req.body.where_to_apply,
        company_logo: req.file.location,
        userId: req.user.id },
        { where:{id: req.params.id}})
    .then(job => res.status(200).json(job))
    .catch(err => res.json({error:err}));
})

/*******************
 *** Delete Jobs ***
*******************/

router.delete('/delete/:id', function(req,res) {
    var data = req.params.id;
    var userid = req.user.id;

    Jobs
        .destroy({
            where: { id: data }
        }).then(
            function deleteJobSuccess(data) {
                res.send("Job Removed")
            },
            function deleteJobFailure(err) {
                res.send(500, err.message);
            }
        );
});

module.exports = router