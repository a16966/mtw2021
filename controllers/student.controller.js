const StudentModel = require("../models/student.js")
const readCSV = require("../config/readCSV.js")
const ClassModel = require("../models/class.js")





async function getStudentId(req, res) {
    const _id = req.sanitize('_id').escape();
    const student = await StudentModel.findById(_id);
    if (!student) return res.status(404).send({ msg: "estudante não encontrado", status:404 });
    const records = await ClassModel.find({}, {
        _id : 1,
        course: 1,
        name: 1,
        year: 1,
        description: 1
    }).where('_id').in(student.classes).exec();
    const msg = { student: student }
    if (records) msg['classes'] = records
    res.send(msg);
}

async function getStudents(req, res) {
    const student = await StudentModel.find({}, {
        _id : 1,
        email: 1,
        name: 1,
        student_number: 1,
        classes: 1
    });
    if (!student) return res.status(404).send({ msg: "estudante não encontrado", status:404 });

    return res.send(student);
}


async function getStudentsPerClass(req, res) {
    const _id = req.sanitize('_id').escape();
    const student = await StudentModel.find({classes:[_id]}, {
        _id : 1,
        email: 1,
        name: 1,
        student_number: 1,
        classes: 1
    });
    if (!student) return res.status(404).send({ msg: "estudante não encontrado", status:404 });

    return res.send(student);
}





async function saveStudents(req, res) {
    await readCSV.readCSV(async function (students) {
        if (!students) return res.status(400).send({ msg: "csv is empty" })
        const _id = req.sanitize('_id').escape();
        const mongoStudents = await StudentModel.find({}, {});
        let insertStudents = []
        let updateStudents = []
        await students.forEach(async function (student) {
            const found = mongoStudents.find(el => el.student_number == student.student_number);
            if (!found) {
                student['classes'] = [_id]
                insertStudents.push(student)
            }
            else {
                if (checkAvailability(found.classes, _id)) return
                //console.log(found.classes)
                found['classes'].push(_id)
                updateStudents.push(found)
            }
        });
        // insert student
        if (insertStudents.length > 0) {
            StudentModel.insertMany(insertStudents).then(function () { }).catch(function (error) {
                console.log(error);
            });
        }
        // update student
        if (updateStudents.length > 0) {
            updateStudents.forEach(async function (updateStudent) {
                const uStudent = await StudentModel.findById(updateStudent._id);
                if (!uStudent) return
                uStudent.set({
                    email: updateStudent.email,
                    name: updateStudent.name,
                    student_number: updateStudent.student_number,
                    classes: updateStudent.classes
                })
                await uStudent.save();
            })
        }
        res.status(200).send({ msg: "estudante inserido com sucesso", status:200 })
    })
}

function checkAvailability(arr, val) {
    return arr.some(arrVal => val === arrVal);
}



module.exports = {
    saveStudents: saveStudents,
    getStudentId: getStudentId,
    getStudents: getStudents,
    getStudentsPerClass : getStudentsPerClass
}