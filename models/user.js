module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('user', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        picture_link: {
            type: DataTypes.STRING,
        },
        portfolio_link: {
            type: DataTypes.STRING,
        },
        about_me:{
            type: DataTypes.TEXT,
        },
        skills: {
            type: DataTypes.TEXT,
        },
        hired: {
            type: DataTypes.BOOLEAN
        }
    })
    return User;
}