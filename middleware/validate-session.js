let jwt = require('jsonwebtoken')
let sequelize = require('../db')
let user = sequelize.import('../models/user')

module.exports = function(req,res,next){
    if(req.method =='OPTIONS'){
        next()
    }else{
        let sessionToken = req.headers.authorization
        if(!sessionToken) return res.status(403).send({auth:false, message:'No token provided.'})
        else{
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded)=>{
                if(decoded){
                    user.findByPk(decoded.id) //tried findByPk instead of findOne
                    .then(user =>{
                        req.user = user
                        next()
                    },
                    ()=>{ //Changed this to arrow function
                        res.status(401).send({error: 'Not authorized'})
                    })
                }else{
                    res.status(400).send({error:'Not authorized'})
                }
            })
        }
    }
}