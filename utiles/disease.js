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

const Disease = sequelize.define('disease',{
    id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    department:Sequelize.STRING,
    disease:Sequelize.STRING,
    Edisease:Sequelize.STRING,
    Damount:Sequelize.INTEGER,
}, {
    timestamps: false,
    tableName: 'disease',
})

function getDiseaseByDep(department,callback){
    Disease.findAll({
        attributes: ['disease'],
        where:{department},
    }).then(projects=>{
        callback(projects)
    }).catch((err)=>{
        console.log(err)
    })
}

function getDisease(myoffset,callback){
    Disease.findAndCountAll({
         offset:myoffset,
         limit: 20
    }).then(projects=>{
        callback(projects)
    })
}

function alterDisease(form){
    Disease.update({
        ...form
    },{
        where: {
            id:form.id
        }
    })
}

function addDisease(form,callback){
    Disease.create({
        department:form.department,
        disease:form.disease,
        Edisease:form.Edisease,
    }).then(projects=>{
        // console.log(projects.dataValues)
        callback(projects.dataValues)
    })
}

function deleteDisease(deleteId){
    Disease.destroy({
        where:{
            id:deleteId
        }
    })
}

module.exports={
    getDiseaseByDep,
    getDisease,
    alterDisease,
    addDisease,
    deleteDisease
}