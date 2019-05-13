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

const Grade = sequelize.define('grade', {
    id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    num:Sequelize.STRING,
    name:Sequelize.STRING,
    department:Sequelize.STRING,
    Sdate:Sequelize.DATE,
    writeMark:Sequelize.STRING,
    physicalMark:Sequelize.STRING,
    analysisMark:Sequelize.STRING,
    performancMark:Sequelize.STRING,
    oralMark:Sequelize.STRING,
    testMark:Sequelize.STRING,
    ethnicsMark:Sequelize.STRING,
    totalMark:Sequelize.STRING,
    signature:Sequelize.STRING,
}, {
    timestamps: false,
    tableName: 'grade',
})

function getAllGrade(callback){
    Grade.findAll().then(projects => {
        callback(projects)
    })
}

function alterGrade(form){
    Grade.update({
        num:form.num,
        name:form.name,
        department:form.department,
        Sdate:form.Sdate,
        writeMark:form.writeMark,
        physicalMark:form.physicalMark,
        analysisMark:form.analysisMark,
        performancMark:form.performancMark,
        oralMark:form.oralMark,
        testMark:form.testMark,
        ethnicsMark:form.ethnicsMark,
        totalMark:form.totalMark,
        signature:form.signature,
      }, {
        where: {
            id:form.id
        }
    })
}

function deleteGrade(deleteId){
    Grade.destroy({
        where: {
            id: deleteId
        }
    })
}

function addGrade(form,callback){
    Grade.create({
        num:form.num,
        name:form.name,
        department:form.department,
        Sdate:form.Sdate,
        writeMark:form.writeMark,
        physicalMark:form.physicalMark,
        analysisMark:form.analysisMark,
        performancMark:form.performancMark,
        oralMark:form.oralMark,
        testMark:form.testMark,
        ethnicsMark:form.ethnicsMark,
        totalMark:form.totalMark,
        signature:form.signature,
    }).then(stu=>{
        callback(stu)
    })
}
//SELECT r.* FROM student as s,grade as r where s.num=r.num and s.hospital="南方医科大学第五附属医院" and r.department="内科"
function hosgetAllGrade(form,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT r.* FROM student as s,grade as r where s.num=r.num and s.hospital='"+form.hospital+"' and r.department='"+form.department+"'"
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
    getAllGrade,
    alterGrade,
    deleteGrade,
    addGrade,
    hosgetAllGrade,
}
