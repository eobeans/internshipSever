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

const Student = sequelize.define('student', {
    id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    num:Sequelize.STRING,
    name:Sequelize.STRING,
    major:Sequelize.STRING,
    rank:Sequelize.STRING,
    nation:Sequelize.STRING,
    city:Sequelize.STRING,
    hospital:Sequelize.STRING,
    phone:Sequelize.STRING,
    email:Sequelize.STRING,
    openId:Sequelize.STRING,
    password:Sequelize.STRING,
}, {
    timestamps: false,
    tableName: 'student',
})

function getAllStudent(callback){
    Student.findAll().then(projects => {
        callback(projects)
    })
}

function alterStudent(form){
    // let a = { a: 1, b: 2};
    // let b = { a: 2, ...{ a: 1, b: 2} }; // { a: 2, b: 2}
    // let a = 1;
    // let b = 2;
    // [a, b] = [b, a];
    Student.update({
        // num:form.num,
        // name:form.name,
        // major:form.major,
        // rank:form.rank,
        // nation:form.nation,
        // city:form.city,
        // hospital:form.hospital,
        // phone:form.phone,
        // email:form.email,
        ...form
      }, {
        where: {
            id:form.id
        }
    })
}

function deleteStudent(deleteId){
    Student.destroy({
        where: {
            id: deleteId
        }
    })
}

function addStudent(form,callback){
    Student.create({
        // num:form.num,
        // name:form.name,
        // major:form.major,
        // rank:form.rank,
        // nation:form.nation,
        // city:form.city,
        // hospital:form.hospital,
        // phone:form.phone,
        // email:form.email
        ...form
    }).then(stu=>{
        callback(stu)
    })
}

function selectStudent(form,callback){
    Student.findAll({
        where:{
            hospital:form.hospital
        }
    }).then(projects => {
        callback(projects)
    })
}

module.exports={
    getAllStudent,
    alterStudent,
    deleteStudent,
    addStudent,
    selectStudent,
}
