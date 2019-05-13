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

const Dailyrecord = sequelize.define('dailyrecord',{
    id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
    num:Sequelize.STRING,
    name:Sequelize.STRING,
    department:Sequelize.STRING,
    date:Sequelize.DATE,
    sick:Sequelize.INTEGER,
    absence:Sequelize.INTEGER,
    truancy:Sequelize.INTEGER,
    late:Sequelize.INTEGER,
    dleave:Sequelize.INTEGER,
    ontime:Sequelize.INTEGER,
    dcheck:Sequelize.INTEGER,
    Rdescription:Sequelize.STRING,
}, {
    timestamps: false,
    tableName: 'dailyrecord',
})

function getAttendance(callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT SUM(sick) as sumSick,SUM(absence) as sumAbsence,SUM(truancy) as sumTruancy,SUM(late) as sumLate,SUM(dleave) as sumLeave,SUM(ontime) as sumOntime,SUM(dcheck) as sumCheck,COUNT(id) as total FROM dailyrecord"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a[0])
            })
        }
    })
}

function getDailyRecordCount(callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT count(1) from dailyrecord as d,medrecord as m WHERE d.num=m.num and d.date=m.date"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a[0])
            })
        }
    })
}

function getDailyRecord(myoffset,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT d.*,m.medId,m.hosId,m.gender,m.age,m.diagnosis,m.operation,m.activity from dailyrecord as d,medrecord as m WHERE d.num=m.num and d.date=m.date LIMIT "+parseInt(myoffset)+","+(parseInt(myoffset)+20)
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a)
            })
        }
    })
}

function hosgetDailyRecordCount(department,hospital,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT count(1) from dailyrecord as d,medrecord as m,student AS s WHERE d.num=m.num and d.date=m.date and d.num=s.num and m.department='"+department+"'and s.hospital='"+hospital+"'"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a[0])
            })
        }
    })
}

function hosgetDailyRecord(myoffset,department,hospital,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT d.*,m.medId,m.hosId,m.gender,m.age,m.diagnosis,m.operation,m.activity from dailyrecord as d,medrecord as m,student AS s WHERE d.num=m.num and d.date=m.date  and d.num=s.num and m.department='"+department+"' and s.hospital='"+hospital+"' LIMIT "+parseInt(myoffset)+","+(parseInt(myoffset)+20)
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a)
            })
        }
    })
}

function deleteDailyRecord(deleteId){
    Dailyrecord.destroy({
        where: {
            id: deleteId
        }
    })
}

function ifDailyRecord(form,callback){
    pool.getConnection((err,connection)=>{
        if (err){
            console.log("建立连接失败")
        }else{
            sql="SELECT * FROM dailyrecord where num='"+form.num+"' and date='"+form.date+"'"
            connection.query(sql,(err,result)=>{
                if(err) throw err

                connection.release()
                let a = dataJson(result)
                callback(a)
            })
        }
    })
}

function addDailyRecord(form,callback) {
    Dailyrecord.create({
        num:form.num,
        name:form.name,
        department:form.department,
        date:form.date,
        sick:form.sick,
        absence:form.absence,
        truancy:form.truancy,
        late:form.late,
        dleave:form.dleave,
        ontime:form.ontime,
        dcheck:form.dcheck,
        Rdescription:form.Rdescription,
    }).then(record=>{
        console.log('add dailyrecord')
        callback(record.dataValues)
    })
}

function alterDailyRecord(form){
    Dailyrecord.update({
        num:form.num,
        name:form.name,
        department:form.department,
        date:form.date,
        sick:form.sick,
        absence:form.absence,
        truancy:form.truancy,
        late:form.late,
        dleave:form.dleave,
        ontime:form.ontime,
        dcheck:form.dcheck,
        Rdescription:form.Rdescription,
      }, {
        where: {
            id:form.id
        }
    })
}

module.exports={
    getAttendance,
    deleteDailyRecord,
    addDailyRecord,
    getDailyRecordCount,
    alterDailyRecord,
    getDailyRecord,
    hosgetDailyRecordCount,
    hosgetDailyRecord,
    ifDailyRecord,
}
  