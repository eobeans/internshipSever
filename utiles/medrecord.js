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

function getMedrecord(callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT num,name,department,count(1) as mycount FROM medrecord GROUP BY num,department"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a)
            })
        }
    })
}

function getdiagnosis(form,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="select diagnosis,count(1) as mycount FROM medrecord WHERE num='" +form.num+"' and department='"+form.department+ "'GROUP BY diagnosis"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a)
            })
        }
    })
}

function getoperation(form,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="select operation,count(1) as mycount FROM medrecord WHERE num='" +form.num +"' and department='"+form.department + "'GROUP BY operation"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a)
            })
        }
    })
}

function getactivity(form,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="select activity,count(1) as mycount FROM dailyrecord WHERE num='" +form.num +"' and department='"+form.department + "'GROUP BY activity"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a)
            })
        }
    })
}

function getMedrecordCount(form,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="select count(1) as mycount FROM medrecord WHERE num='" +form.num +"' and date='"+form.date +"'"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a[0])
            })
        }
    })
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

const Medrecord = sequelize.define('medrecord',{
    medId:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    num:Sequelize.STRING,
    date:Sequelize.DATE,
    hosId:Sequelize.STRING,
    gender:Sequelize.STRING,
    age:Sequelize.INTEGER,
    diagnosis:Sequelize.STRING,
    operation:Sequelize.STRING,
    department:Sequelize.STRING,
    name:Sequelize.STRING,
}, {
    timestamps: false,
    tableName: 'medrecord',
})

function deleteMedrecord(deleteId){
    Medrecord.destroy({
        where: {
            medId: deleteId
        }
    })
}

function addMedrecord(form,callback){
    Medrecord.create({
        num:form.num,
        date:form.date,
        hosId:form.hosId,
        gender:form.gender,
        age:form.age,
        diagnosis:form.diagnosis,
        operation:form.operation,
        department:form.department,
        name:form.name,
    }).then(record=>{
        console.log('add medrecord')
        callback(record.dataValues)
    })
}

function alterMedrecord(form){
    Medrecord.update({
        num:form.num,
        date:form.date,
        hosId:form.hosId,
        gender:form.gender,
        age:form.age,
        diagnosis:form.diagnosis,
        operation:form.operation,
        department:form.department,
        name:form.name,
      }, {
        where: {
            medId:form.medId
        }
    })
}



module.exports={
    deleteMedrecord,
    addMedrecord,
    alterMedrecord,
    getMedrecord,
    getdiagnosis,
    getoperation,
    getactivity,
    getMedrecordCount,
}
  