const router = require('express').Router()
var sequelize = require('../db');
var Jobs = sequelize.import('../models/jobs');
var validatesession = require('../middleware/validate-session');

/****************
 *** Get Jobs ***
****************/

// Get All Jobs

router.get('/alljobs', (req, res) => {
    Jobs.findAll()
    .then(job => res.status(200).json(job))
    .create(err => res.status(500).json({ error: err }))
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

router.post('/create', (req, res) => {
    Jobs.create({
        job_title: req.body.job.job_title,
        company_name: req.body.job.company_name,
        company_info: req.body.job.company_info,
        position_summary: req.body.job.position_summary,
        desired_skills: req.body.job.desired_skills,
        how_to_apply: req.body.job.how_to_apply
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

router.put('/:id', (req, res) => {
    Jobs.update(req.body.job,{
        where:{id: req.params.id, owner: req.job.id}
    })
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
            where: { id: data, owner: userid }
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