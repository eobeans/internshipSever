const Promise = require('promise')
const Sequelize = require('sequelize')
const mysql = require('mysql')

let pool = mysql.createPool({
    host : 'localhost',
    port : 3306,
    database : 'internship',
    user : 'root',
    password : 'mayongjie'
})

function dataJson(data){
    a=JSON.stringify(data)
    b=JSON.parse(a)
    return b
}

const sequelize = new Sequelize('internship', 'root', 'mayongjie', {
    host: 'localhost',
    port:3306,
    dialect: 'mysql',
}, {
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })

const Rotation = sequelize.define('rotation',{
    id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    num:Sequelize.STRING,
    name:Sequelize.STRING,
    department:Sequelize.STRING,
    beginTime:Sequelize.DATE,
    endTime:Sequelize.DATE,
    report:Sequelize.STRING,
    reportDate:Sequelize.DATE,
    teachComment:Sequelize.STRING,
    directorComment:Sequelize.STRING,
    directorCheck:Sequelize.STRING,
    checkDate:Sequelize.DATE,
}, {
    timestamps: false,
    tableName: 'rotation',
})

function getAllRotation(callback){
    Rotation.findAll().then(projects => {
        callback(projects)
    })
}

function deleteRotation(deleteId){
    Rotation.destroy({
        where: {
            id: deleteId
        }
    })
}

function addRotation(form,callback){
    Rotation.create({
        num:form.num,
        name:form.name,
        department:form.department,
        beginTime:form.beginTime,
        endTime:form.endTime,
        report:form.report,
        reportDate:form.reportDate,
        teachComment:form.teachComment,
        directorComment:form.directorComment,
        directorCheck:form.directorCheck,
        checkDate:form.checkDate,
    }).then(record=>{
        callback(record.dataValues)
    })
}

function alterRotation(form){
    Rotation.update({
        num:form.num,
        name:form.name,
        department:form.department,
        beginTime:form.beginTime,
        endTime:form.endTime,
        report:form.report,
        reportDate:form.reportDate,
        teachComment:form.teachComment,
        directorComment:form.directorComment,
        directorCheck:form.directorCheck,
        checkDate:form.checkDate,
      }, {
        where: {
            id:form.id
        }
    })
}
function hosgetAllRotation(form,callback){
    //SELECT r.* FROM student as s,rotation as r where s.num=r.num and s.hospital="南方医科大学第五附属医院" and r.department="内科"
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT r.* FROM student as s,rotation as r where s.num=r.num and s.hospital='"+form.hospital+"' and r.department='"+form.department+"'"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a)
            })
        }
    })
}

module.exports={
    getAllRotation,
    deleteRotation,
    addRotation,
    alterRotation,
    hosgetAllRotation,
}
  