const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const Promise = require('promise')
let moment = require('moment')
let dailyrecord=require('.//utiles/dailyrecord.js')
let student =  require('./utiles/student')
let rotation = require('./utiles/rotation')
let Grade = require('.//utiles/grade')
let medrecord=require('./utiles/medrecord')
let disease=require('./utiles/disease')
let operation=require('./utiles/operation')
let teacher= require('./utiles/teacher')
let doctor = require('./utiles/doctor')
const app = express()

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')//http://localhost:8080
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
    res.header('Access-Control-Allow-Methods', 'GET,POST')
    res.header('Access-Control-Allow-Credentials','true')
    res.header("X-Powered-By",'*')
    res.header("Content-Type", "application/json;charset=utf-8")

    next();
}

app.use(allowCrossDomain)


app.use(cookieParser())
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send('hello')
})

//student
        //student
                //student
                        //student
                                //student
                                        //student
app.get('/getAttendance.json',(req,res)=>{
    new Promise((resolve, reject)=>{
        dailyrecord.getAttendance(result=>{
            let myArray=new Array()
            myArray.push({value:result.sumSick,name:"病假"})
            myArray.push({value:result.sumAbsence,name:"事假"})
            myArray.push({value:result.sumTruancy,name:"旷课"})
            myArray.push({value:result.sumLate,name:"迟到"})
            myArray.push({value:result.sumLeave,name:"早退"})
            myArray.push({value:result.sumOntime,name:"按时"})
            // myArray.push({value:result.sumCheck,name:"检查"})
            let check = result.sumCheck
            let total = result.total
            let recordObj={
                myArray,
                check,
                total,
            }
            resolve(recordObj)
        })
    }).then((result)=>{
        if(result != null){
            let obj={
                code:0,
                data:result.myArray,
                check:result.check,
                total:result.total
            }
            res.json(obj)
        }else{
            let errObj={
                code:1,
                err:'获取考勤信息错误！请联系运维人员'
            }
            res.json(errObj)
        }
    })

})

app.get('/getAllStudent.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        student.getAllStudent(result=>{
            let myArray=new Array()
            for(let i=0;i<result.length;i++){
                myArray.push(result[i].dataValues)
            }
            resolve(myArray)
        })
    }).then(result=>{
        if(result!=null){
            let obj={
                code:0,
                data:result,
            }
            res.json(obj)
        }else{
            let obj={
                code:1,
                err:'没有学生信息，请输入学生信息！'
            }
            res.json(obj)
        }
    })
})

app.post('/alterStudent.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let alterStudent=req.body.editForm
        student.alterStudent(alterStudent)
        resolve(alterStudent)
    }).then((result)=>{
        let msg=result.name+"的信息更改成功"
        let obj={
            code:0,
            msg,
        }
        res.json(obj)
    })
})

app.post('/deleteStudent.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let deleteId=req.body.deleteId
        student.deleteStudent(deleteId)
        resolve(deleteId)
    }).then((result)=>{
        let msg="信息删除成功"
        let obj={
            code:0,
            msg,
            deleteId:result,
        }
        res.json(obj)
    })
})

app.post('/addStudent.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let addForm=req.body.addForm
        student.addStudent(addForm,(stu)=>{
            resolve(stu)
        })
    }).then((result)=>{
        let msg="信息添加成功"
        let obj={
            code:0,
            msg,
            data:result,
        }
        res.json(obj)
    })
})

app.get('/getDepartment.json',(req,res)=>{
    disease.getDepartmentList(result=>{
        let departmentList=new Array()
        for(i=0;i<result.length;i++){
            departmentList.push(result[i].department)
        }
        let obj={
            code:0,
            departmentList,
        }
        res.json(obj)
    })
})

app.get('/getDailyRecordCount.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        dailyrecord.getDailyRecordCount(result=>{
            let mycount=result.count
            resolve(mycount)
        })
    }).then(mycount=>{
        if(mycount!=0){
            let obj={
                code:0,
                mycount,
            }
            res.json(obj)
        }else{
            let obj={
                code:1
            }
            res.json(obj)
        }
    })
})

app.post('/getDailyRecord.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let myoffset=req.body.myoffset
        dailyrecord.getDailyRecord(myoffset,(result)=>{
            let myArray=new Array()
            for(let i=0;i<result.length;i++){
                result[i].attendence=[]
                if(result[i].late==1){
                    result[i].attendence.push('迟到一次')
                }else if(result[i].late==2){
                    result[i].attendence.push('迟到两次')
                }
                if(result[i].dleave==1){
                    result[i].attendence.push('早退一次')
                }else if(result[i].dleave==2){
                    result[i].attendence.push('早退两次')
                }
                if(result[i].sick==1){
                    result[i].attendence.push('病假一天')
                }else if(result[i].sick==0.5){
                    result[i].attendence.push('病假半天')
                }
                if(result[i].absence==1){
                    result[i].attendence.push('事假一天')
                }else if(result[i].absence==0.5){
                    result[i].attendence.push('事假半天')
                }
                if(result[i].truancy==1){
                    result[i].attendence.push('旷课一天')
                }else if(result[i].truancy==0.5){
                    result[i].attendence.push('旷课半天')
                }
                if(result[i].ontime==1){
                    result[i].attendence.push('按时')
                }
                result[i].date=moment(result[i].date).format("YYYY-MM-DD")
                myArray.push(result[i])
            }
            resolve(myArray)
        })
    }).then(result=>{
        if(result!=null){
            let obj={
                code:0,
                data:result,
            }
            res.json(obj)
        }else{
            let obj={
                code:1,
                err:'没有每日实习情况信息，请稍后再试'
            }
            res.json(obj)
        }
    })
})

app.post('/deleteDailyRecord.json',(req,res)=>{
    let deleteId=req.body.deleteId
    new Promise((resolve,reject)=>{
        medrecord.getMedrecordCount(deleteId,(result)=>{
            if(result.mycount>1){
                resolve(1)
            }else{
                resolve(0)
            }
        })
    }).then((bool)=>{
        if(bool==1){
            console.log('delete medrecord but not dailyrecord')
        }else if(bool==0){
            dailyrecord.deleteDailyRecord(deleteId.id)
        }
    }).then(()=>{
        medrecord.deleteMedrecord(deleteId.medId)
        let msg="信息删除成功"
        let obj={
            code:0,
            msg,
            deleteId,
        }
        res.json(obj)
    })
})

app.post('/addDailyRecord.json',(req,res)=>{
    let addForm=req.body.addForm
    addForm.date=moment(addForm.date).format("YYYY-MM-DD")
    new Promise((resolve,reject)=>{
        dailyrecord.ifDailyRecord(addForm,(result)=>{
            if(result===null||JSON.stringify(result)==='[]'){
                let bool=1
                //console.log(1)
                resolve(bool)
            }else{
                let bool=0
                //console.log(0)
                resolve(bool)
            }
        })
    }).then((bool)=>{
        if(bool==1){
            dailyrecord.addDailyRecord(addForm,(result)=>{
                addForm.id=result.id
            })
        }
    }).then(()=>{
        medrecord.addMedrecord(addForm,(result)=>{
            addForm.medId=result.medId
            // console.log(addForm.medId)
            let msg="每日实习汇报信息添加成功"
            let obj={
                code:0,
                data:addForm,
                msg,
            }
            res.json(obj)
        })
    })
})

app.post('/alterDailyRecord.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let editForm=req.body.editForm
        dailyrecord.alterDailyRecord(editForm)
        resolve(editForm)
    }).then((editForm)=>{
        medrecord.alterMedrecord(editForm)
    }).then(()=>{
        let msg="信息更改成功"
        let obj={
            code:0,
            msg,
        }
        res.json(obj)
    })
})

// app.post('/newAlterDailyRecord.json',(req,res)=>{
//     let editForm=req.body.editForm
//     new Promise((resolve,reject)=>{
//         medrecord.getMedrecordCount(result=>{
//             resolve(result.mycount)
//         })
//     }).then((mycount)=>{
//         //改学号、时间等和dailyrecord关联的信息
//         //如果能用外键，就不用设置学号、时间这些信息了
//         for(i=0;i<mycount;i++){
//             medrecord.alterMedrecord(editForm)
//         }
//     }).then(()=>{
//         dailyrecord.alterDailyRecord(editForm)
//         let msg="信息更改成功"
//         let obj={
//             code:0,
//             msg,
//         }
//         res.json(obj)
//     })
// })

app.post('/getDailyRecordByNum.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        dailyrecord.getDailyRecordByNum(req.body.num,(result)=>{
            resolve(result)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
        }
        res.json(obj)
    })
})

app.post('/getList.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        disease.getDiseaseByDep(req.body.department,(result)=>{
            let obj={
                code:1,
                diagnosisList:[],
                operationList:[]
            }
            for(let i=0;i<result.length;i++){
                obj.diagnosisList.push(result[i].dataValues.disease)
            }
            resolve(obj)
        })
    }).then(myobj=>{
        operation.getOperationByDep(req.body.department,(result)=>{
            for(let i=0;i<result.length;i++){
                myobj.operationList.push(result[i].dataValues.operation)
            }
            myobj.code=0
            res.json(myobj)
        })
    })
})

//rotation
        //rotation
                //rotation
                        //rotation
                                //rotation
                                        //rotation
app.get('/getAllRotation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        rotation.getAllRotation(result=>{
            let myArray=new Array()
            for(let i=0;i<result.length;i++){
                let a = moment(result[i].dataValues.endTime) //endTime
                let b = moment(result[i].dataValues.beginTime) //beginTime
                let c=a.diff(b, 'days')
                result[i].dataValues.myduration=c
                myArray.push(result[i].dataValues)
            }
            resolve(myArray)
        })
    }).then(result=>{
        if(result!=null){
            let obj={
                code:0,
                data:result,
            }
            res.json(obj)
        }
    })
})

app.post('/deleteRotation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let deleteId=req.body.deleteId
        rotation.deleteRotation(deleteId)
        resolve(deleteId)
    }).then((result)=>{
        let msg="信息删除成功"
        let obj={
            code:0,
            msg,
            deleteId:result,
        }
        res.json(obj)
    })
})

app.post('/addRotation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let addForm=req.body.addForm
        rotation.addRotation(addForm,(record)=>{
            resolve(record)
        })
    }).then((result)=>{
        let msg="信息添加成功"
        let obj={
            code:0,
            msg,
            data:result,
        }
        res.json(obj)
    })
})

app.post('/alterRotation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let alterRotation=req.body.editForm
        rotation.alterRotation(alterRotation)
        resolve(alterRotation)
    }).then((result)=>{
        let msg=result.name+"的信息更改成功"
        let obj={
            code:0,
            msg,
        }
        res.json(obj)
    })
})
//grade
        //grade
                //grade
                        //grade
                                //grade
                                        //grade
app.get('/getAllGrade.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        Grade.getAllGrade(result=>{
            let myArray=new Array()
            for(let i=0;i<result.length;i++){
                myArray.push(result[i].dataValues)
            }
            resolve(myArray)
        })
    }).then(result=>{
        if(result!=null){
            let obj={
                code:0,
                data:result,
            }
            res.json(obj)
        }else{
            let obj={
                code:1,
                err:'没有任何成绩单信息'
            }
            res.json(obj)
        }
    })
})

app.post('/alterGrade.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let alterGrade=req.body.editForm
        Grade.alterGrade(alterGrade)
        resolve(alterGrade)
    }).then((result)=>{
        let msg=result.name+"的信息更改成功"
        let obj={
            code:0,
            msg,
        }
        res.json(obj)
    })
})

app.post('/deleteGrade.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let deleteId=req.body.deleteId
        Grade.deleteGrade(deleteId)
        resolve(deleteId)
    }).then((result)=>{
        let msg="信息删除成功"
        let obj={
            code:0,
            msg,
            deleteId:result,
        }
        res.json(obj)
    })
})

app.post('/addGrade.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let addForm=req.body.addForm
        Grade.addGrade(addForm,(stu)=>{
            resolve(stu)
        })
    }).then((result)=>{
        let msg="信息添加成功"
        let obj={
            code:0,
            msg,
            data:result,
        }
        res.json(obj)
    })
})
//diseaserecord
        //diseaserecord
                //diseaserecord
                        //diseaserecord
                                //diseaserecord
                                        //diseaserecord
app.post('/getMedrecord.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        medrecord.getMedrecord((stu)=>{
            resolve(stu)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            total:0
        }
        // for(let i=0;i<result.length;i++){
        //     obj.total=parseInt(obj.total)+parseInt(result[i].mycount)
        // }
        res.json(obj)
    })
})

app.post('/getdiagnosis.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        medrecord.getdiagnosis(req.body.form,(stu)=>{
            resolve(stu)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
        }
        res.json(obj)
    })
})
app.post('/getoperation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        medrecord.getoperation(req.body.form,(stu)=>{
            resolve(stu)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
        }
        res.json(obj)
    })
})

app.post('/getactivity.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        medrecord.getactivity(req.body.form,(stu)=>{
            resolve(stu)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
        }
        res.json(obj)
    })
})

app.post('/getDisease.json' ,(req,res)=>{
    new Promise((resolve,reject)=>{
        disease.getDisease(req.body.myoffset,(stu)=>{
            resolve(stu)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:[],
            total:result.count,
        }
        let myArray=new Array()
        for(let i=0;i<result.rows.length;i++){
            myArray.push(result.rows[i].dataValues)
        }
        obj.data=myArray
        res.json(obj)
    })
})

app.post('/addDisease.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        disease.addDisease(req.body.form,(result)=>{
            resolve(result)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"病种添加成功"
        }
        res.json(obj)
    })
})

app.post('/alterDisease.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        disease.alterDisease(req.body.form)
        let alterForm=req.body.form
        resolve(alterForm)
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"病种修改成功"
        }
        res.json(obj)
    })
})

app.post('/deleteDisease.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        disease.deleteDisease(req.body.deleteId)
        let deleteId=req.body.deleteId
        resolve(deleteId)
    }).then((result)=>{
        let obj={
            code:0,
            deleteId:result,
            msg:"病种删除成功"
        }
        res.json(obj)
    })
})

app.post('/getDiffOperation.json' ,(req,res)=>{
    new Promise((resolve,reject)=>{
        operation.getOperation(req.body.myoffset,(stu)=>{
            resolve(stu)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:[],
            total:result.count,
        }
        let myArray=new Array()
        for(let i=0;i<result.rows.length;i++){
            myArray.push(result.rows[i].dataValues)
        }
        obj.data=myArray
        res.json(obj)
    })
})

app.post('/addOperation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        operation.addOperation(req.body.form,(result)=>{
            resolve(result)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"临床操作添加成功"
        }
        res.json(obj)
    })
})

app.post('/alterOperation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        operation.alterOperation(req.body.form)
        let alterForm=req.body.form
        resolve(alterForm)
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"临床操作修改成功"
        }
        res.json(obj)
    })
})
app.post('/deleteOperation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        operation.deleteOperation(req.body.deleteId)
        let deleteId=req.body.deleteId
        resolve(deleteId)
    }).then((result)=>{
        let obj={
            code:0,
            deleteId:result,
            msg:"临床操作删除成功"
        }
        res.json(obj)
    })
})

app.post('/postUser.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        teacher.selectTeacher(req.body.loginForm,(result)=>{
            // console.log(result.teaNum) //123
            resolve(result)
        })
    }).then(result=>{
        if(result==null){
            let obj={
                code:1
            }
            res.json(obj)
        }else{
            let obj={
                code:0,
                teaNum:result.teaNum,
            }
            res.json(obj)
        }
    })
})

//doctor  getDoctor.json
app.get('/getDoctor.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        doctor.getDoctor(result=>{
            let myArray=new Array()
            for(let i=0;i<result.length;i++){
                myArray.push(result[i].dataValues)
            }
            resolve(myArray)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
        }
        res.json(obj)
    })
})
//addDoctor.json
app.post('/addDoctor.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        doctor.addDoctor(req.body.form,(result)=>{
            resolve(result)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"信息添加成功"
        }
        res.json(obj)
    })
})
//deleteDoctor
app.post('/deleteDoctor.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        doctor.deleteDoctor(req.body.deleteId)
        let deleteId=req.body.deleteId
        resolve(deleteId)
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"信息删除成功"
        }
        res.json(obj)
    })
})
//alterDoctor
app.post('/alterDoctor.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        doctor.alterDoctor(req.body.form)
        let alterForm=req.body.form
        resolve(alterForm)
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"信息修改成功"
        }
        res.json(obj)
    })
})
//getTeacher.json
app.get('/getTeacher.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        teacher.getTeacher(result=>{
            let myArray=new Array()
            for(let i=0;i<result.length;i++){
                myArray.push(result[i].dataValues)
            }
            resolve(myArray)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
        }
        res.json(obj)
    })
})

//addTeacher
app.post('/addTeacher.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        teacher.addTeacher(req.body.form,(result)=>{
            resolve(result)
        })
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"信息添加成功"
        }
        res.json(obj)
    })
})
app.post('/deleteTeacher.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        teacher.deleteTeacher(req.body.deleteId)
        let deleteId=req.body.deleteId
        resolve(deleteId)
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"信息删除成功"
        }
        res.json(obj)
    })
})
app.post('/alterTeacher.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        teacher.alterTeacher(req.body.form)
        let alterForm=req.body.form
        resolve(alterForm)
    }).then((result)=>{
        let obj={
            code:0,
            data:result,
            msg:"信息修改成功"
        }
        res.json(obj)
    })
})
///hosipital
///hosipital
///hosipital
///hosipital
app.post('/hospostUser.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        doctor.selectDoctor(req.body.loginForm,(result)=>{
            // console.log(result.teaNum) //123
            resolve(result)
        })
    }).then(result=>{
        if(result==null){
            let obj={
                code:1
            }
            res.json(obj)
        }else{
            let obj={
                code:0,
                data:result,
            }
            res.json(obj)
        }
    })
})
app.post('/hosgetAllStudent.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        student.selectStudent(req.body.form,(result)=>{
            // console.log(result.teaNum) //123
            resolve(result)
        })
    }).then(result=>{
        if(result==null){
            let obj={
                code:1
            }
            res.json(obj)
        }else{
            let obj={
                code:0,
                data:result,
            }
            res.json(obj)
        }
    })
})

app.post('/hosgetDailyRecordCount.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        dailyrecord.hosgetDailyRecordCount(req.body.department,req.body.hospital,(result)=>{
            let mycount=result
            resolve(mycount)
        })
    }).then(mycount=>{
        if(mycount!=0){
            let obj={
                code:0,
                mycount,
            }
            res.json(obj)
        }else{
            let obj={
                code:1
            }
            res.json(obj)
        }
    })
})

app.post('/hosgetDailyRecord.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        let myoffset=req.body.myoffset
        let department=req.body.department
        dailyrecord.hosgetDailyRecord(myoffset,department,req.body.hospital,(result)=>{
            let myArray=new Array()
            for(let i=0;i<result.length;i++){
                result[i].attendence=[]
                if(result[i].late==1){
                    result[i].attendence.push('迟到一次')
                }else if(result[i].late==2){
                    result[i].attendence.push('迟到两次')
                }
                if(result[i].dleave==1){
                    result[i].attendence.push('早退一次')
                }else if(result[i].dleave==2){
                    result[i].attendence.push('早退两次')
                }
                if(result[i].sick==1){
                    result[i].attendence.push('病假一天')
                }else if(result[i].sick==0.5){
                    result[i].attendence.push('病假半天')
                }
                if(result[i].absence==1){
                    result[i].attendence.push('事假一天')
                }else if(result[i].absence==0.5){
                    result[i].attendence.push('事假半天')
                }
                if(result[i].truancy==1){
                    result[i].attendence.push('旷课一天')
                }else if(result[i].truancy==0.5){
                    result[i].attendence.push('旷课半天')
                }
                if(result[i].ontime==1){
                    result[i].attendence.push('按时')
                }
                result[i].date=moment(result[i].date).format("YYYY-MM-DD")
                myArray.push(result[i])
            }
            resolve(myArray)
        })
    }).then(result=>{
        if(result!=null){
            let obj={
                code:0,
                data:result,
            }
            res.json(obj)
        }else{
            let obj={
                code:1,
                err:'没有每日实习情况信息，请稍后再试'
            }
            res.json(obj)
        }
    })
})
app.post('/hosgetAllRotation.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        rotation.hosgetAllRotation(req.body.form,(result)=>{
            let myArray=new Array()
            for(let i=0;i<result.length;i++){
                let a = moment(result[i].endTime) //endTime
                let b = moment(result[i].beginTime) //beginTime
                let c=a.diff(b, 'days')
                result[i].myduration=c
                result[i].beginTime=moment(result[i].beginTime).format("YYYY-MM-DD")
                result[i].endTime=moment(result[i].endTime).format("YYYY-MM-DD")
                result[i].checkDate=moment(result[i].checkDate).format("YYYY-MM-DD")
                myArray.push(result[i].dataValues)
            }
            resolve(result)
        })
    }).then(result=>{
        let obj={
            code:0,
            data:result,
        }
        res.json(obj)
    })
})
app.post('/hosgetAllGrade.json',(req,res)=>{
    new Promise((resolve,reject)=>{
        Grade.hosgetAllGrade(req.body.form,(result)=>{
            for(let i=0;i<result.length;i++){
                result[i].Sdate=moment(result[i].Sdate).format("YYYY-MM-DD")
            }
            resolve(result)
        })
    }).then(result=>{
        if(result!=null){
            let obj={
                code:0,
                data:result,
            }
            res.json(obj)
        }else{
            let obj={
                code:1,
                err:'没有任何成绩单信息'
            }
            res.json(obj)
        }
    })
})

app.listen(3000,()=>{
    console.log('server run at port 3000!')
})