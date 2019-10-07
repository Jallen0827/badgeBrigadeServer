module.exports = (sequelize, DataTypes)=>{
    const Jobs = sequelize.define('job', {
        job_title: {
            type: DataTypes.STRING,
        },
        company_name: {
            type: DataTypes.STRING,
        },
        company_info:{
            type: DataTypes.STRING,
        },
        position_summary: {
            type: DataTypes.STRING,
        },
        desired_skills: {
            type: DataTypes.STRING
        },
        how_to_apply: {
            type: DataTypes.STRING
        }
    })
    return Jobs;
}