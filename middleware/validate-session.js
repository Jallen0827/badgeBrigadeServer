let jwt = require('jsonwebtoken')
let sequelize = require('../db')
let user = sequelize.import('../models/user')

module.exports = function(req,res,next){
    console.log(req.query.userId);
    console.log(req.headers)
    if(req.method =='OPTIONS'){
        next()
    }else{
        let sessionToken = req.headers.authorization
        if(!sessionToken) return res.status(403).send({auth:false, message:'No token provided.'})
        else{
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded)=>{
                if(decoded){
                    console.log(decoded)
                    user.findByPk(decoded.id) //tried findByPk instead of findOne
                    .then(user =>{
                        // console.log(req.params.id)
                        // console.log(`Inside the auth function.`)
                        if (user.role === 'Admin' || req.query.userId == decoded.id){
                        req.user = user
                        // console.log(`inside the if statement.`)
                        // console.log(user.role)
                        // console.log(user.id)
                        // console.log(decoded.id)
                        next()
                        }else{
                            res.status(400).send( { error:'not authorized.' } ) 
                        }
                    },
                    ()=>{ //Changed this to arrow function
                        res.status(401).send({error: 'Not authorized'})
                    })
                }else{
                    res.status(402).send({error:'Not aAuthorized'})
                }
            })
        }
    }
}