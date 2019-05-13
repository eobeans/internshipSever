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

const Doctor = sequelize.define('doctor', {
    id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    docNum:Sequelize.STRING,
    docName:Sequelize.STRING,
    docPhone:Sequelize.STRING,
    docPassword:Sequelize.STRING,
    docHosipital:Sequelize.STRING,
    docDepartment:Sequelize.STRING,
}, {
    timestamps: false,
    tableName: 'doctor',
})


function getDoctor(callback){
    Doctor.findAll({}).then(projects=>{
        callback(projects)
    })
}
function addDoctor(form,callback){
    Doctor.create({
        ...form
    }).then(projects=>{
        callback(projects.dataValues)
    })
}
function deleteDoctor(deleteId){
    Doctor.destroy({
        where:{
            id:deleteId
        }
    })
}
function alterDoctor(form){
    Doctor.update({
        ...form
    },{
        where: {
            id:form.id
        }
    })
}

function selectDoctor(form,callback){
    Doctor.findOne({ 
        where: {
            docNum: form.username,
            docPassword:form.password,
        } 
    }).then(project => {
        callback(project)
      })
}

module.exports={
    getDoctor,
    addDoctor,
    deleteDoctor,
    alterDoctor,
    selectDoctor,
}
