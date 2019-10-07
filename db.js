const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.NAME,'postgres',process.env.PASS,
    {
        host: 'localhost',
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

User = sequelize.import('./models/user');
Jobs = sequelize.import('./models/jobs');

User.hasMany(Jobs)

module.exports = sequelize