module.exports = (sequelize, DataTypes)=>{
    const Profile = sequelize.define('profile', {
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
        role: {
            type: DataTypes.STRING
            // allowNull: false
        },
        hired: {
            type: DataTypes.BOOLEAN
        }
    })
    return Profile;
}