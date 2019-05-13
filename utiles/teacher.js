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

const Teacher = sequelize.define('teacher', {
    id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    teaNum:Sequelize.STRING,
    teaName:Sequelize.STRING,
    teaPhone:Sequelize.STRING,
    teaPassword:Sequelize.STRING,
}, {
    timestamps: false,
    tableName: 'teacher',
})

function selectTeacher(form,callback){
    Teacher.findOne({ 
        where: {
            teaNum: form.username,
            teaPassword:form.password,
        } 
    }).then(project => {
        callback(project)
      })
}
function getTeacher(callback){
    Teacher.findAll({}).then(projects=>{
        callback(projects)
    })
}
function addTeacher(form,callback){
    Teacher.create({
        ...form
    }).then(projects=>{
        callback(projects.dataValues)
    })
}
function deleteTeacher(deleteId){
    Teacher.destroy({
        where:{
            id:deleteId
        }
    })
}
function alterTeacher(form){
    Teacher.update({
        ...form
    },{
        where: {
            id:form.id
        }
    })
}
module.exports={
    selectTeacher,
    getTeacher,
    addTeacher,
    deleteTeacher,
    alterTeacher,
}
