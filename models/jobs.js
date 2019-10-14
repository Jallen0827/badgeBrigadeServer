module.exports = (sequelize, DataTypes)=>{
    const Jobs = sequelize.define('job', {
        job_title: {
            type: DataTypes.TEXT
        },
        company_name: {
            type: DataTypes.TEXT
        },
        company_info:{
            type: DataTypes.TEXT
        },
        position_summary: {
            type: DataTypes.TEXT
        },
        desired_skills: {
            type: DataTypes.TEXT
        },
        how_to_apply: {
            type: DataTypes.TEXT
        }
    })
    return Jobs;
}