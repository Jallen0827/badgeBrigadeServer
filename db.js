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

const db = {};

db.Sequelize = Sequelize; 
db.sequelize = sequelize;

db.User = require('./models/user')(sequelize, Sequelize);
db.Jobs = require('./models/jobs')(sequelize, Sequelize);
db.Profile = require('./models/profile')(sequelize, Sequelize);

db.User.hasOne(db.Profile);
db.Profile.belongsTo(db.User, {foreignKey: 'userID'});

db.User.hasMany(db.Jobs);
db.Jobs.belongsTo(db.User, {foreignKey: 'userID'});

module.exports = sequelize;