const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL,
    {
        dialect: 'postgres'
    })

sequelize.authenticate().then(
    function (){
        console.log('Connected to redBadge postgress database')
    },
    function(err){
        console.log(err)
    }
)


module.exports = sequelize;