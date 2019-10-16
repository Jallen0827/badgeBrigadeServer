module.exports = (sequelize, DataTypes)=>{
    const Jobs = sequelize.define('job', {
        job_title: {
            type: DataTypes.TEXT
        },
        company_name: {
            type: DataTypes.TEXT
        },
        position_summary: {
            type: DataTypes.TEXT
        },
        contact_email: {
            type: DataTypes.STRING
        },
        where_to_apply: {
            type: DataTypes.STRING
        },
        company_logo: {
            type: DataTypes.STRING
        }
    })
    return Jobs;
}