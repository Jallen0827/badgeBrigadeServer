module.exports = (sequelize, DataTypes)=>{
    const Profile = sequelize.define('user', {
        picture_link: {
            type: DataTypes.STRING,
        },
        portfolio_link: {
            type: DataTypes.STRING,
        },
        about_me:{
            type: DataTypes.STRING,
        },
        skills: {
            type: DataTypes.STRING,
        },
    })
    return Profile;
}