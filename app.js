require('dotenv').config()

let express = require('express')
let app = express()
let Jobs = require('./controllers/jobsController')
let User = require('./controllers/userController')
let Profile = require('./controllers/profileController')
let sequelize= require('./db')

sequelize.sync()
app.use(express.json())

app.use(require('./middleware/headers'))
app.use('/user', User)

app.use(require('./middleware/validate-session'))
app.use('/jobs', Jobs)
app.use('/profile', Profile)

app.listen(process.env.PORT, ()=>{
    console.log(`App is listening on ${process.env.PORT}... Hopefully`)
})