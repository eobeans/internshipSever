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

const Operation = sequelize.define('operation',{
    id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    department:Sequelize.STRING,
    operation:Sequelize.STRING,
    Eoperation:Sequelize.STRING,
    Oamount:Sequelize.INTEGER,
}, {
    timestamps: false,
    tableName: 'operation',
})

function getOperationByDep(department,callback){
    Operation.findAll({
        attributes: ['operation'],
        where:{department}
    }).then(projects=>{
        callback(projects)
    })
}

function getOperation(myoffset,callback){
    Operation.findAndCountAll({
         offset:myoffset,
         limit: 20
    }).then(projects=>{
        callback(projects)
    })
}

function addOperation(form,callback){
    Operation.create({
        ...form
    }).then(projects=>{
        callback(projects.dataValues)
    })
}

function alterOperation(form){
    Operation.update({
        ...form
    },{
        where: {
            id:form.id
        }
    })
}

function deleteOperation(deleteId){
    Operation.destroy({
        where:{
            id:deleteId
        }
    })
}

module.exports={
    getOperationByDep,
    getOperation,
    addOperation,
    alterOperation,
    deleteOperation,
}