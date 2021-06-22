const ComponentModel = require("../models/component")
const StudentModel = require("../models/student")
const ClassModel = require("../models/class.js")


async function getComponentId(req, res) {
    const _id = req.sanitize('_id').escape();
    const component = await ComponentModel.findById(_id);
    if (!component) return res.status(404).send({ msg: "componente não encontrada", status:404 });
    res.send(component);
}


async function getComponents(req, res) {
    const components = await ComponentModel.find({}, {
        _id: 1,
        classId: 1,
        name: 1,
        description: 1

    });
    if (!components) return res.status(404).send({ msg: "componente não encontrada", status:404 });
    const classes = await ClassModel.find({}, {
        _id : 1,
        course: 1,
        name: 1
    });
    if (!classes) return res.status(404).send({ msg: "UCs não encontradas", status:404 });
    const msg = []
    components.forEach(async function (component) {
        const found = classes.find(el => el._id == component.classId);
        if (!found) return
        const addComponent = {
            _id: component._id,
            classId: component.classId,
            name: component.name,
            description: component.description,
            className: found.name,
            classCourse: found.course
        }
        msg.push(addComponent)
    })
    return res.send(msg);
}

async function getComponentsByClasses(req, res) {
    const _id = req.sanitize('_id').escape();
    const components = await ComponentModel.find({classId: _id}, {
        _id: 1,
        classId: 1,
        name: 1,
        description: 1

    });
    if (!components) return res.status(404).send({ msg: "componente não encontrada", status:404 });
    const classes = await ClassModel.find({}, {
        _id : 1,
        course: 1,
        name: 1
    });
    if (!classes) return res.status(404).send({ msg: "UCs não encontradas", status:404 });
    const msg = []
    components.forEach(async function (component) {
        const found = classes.find(el => el._id == component.classId);
        if (!found) return
        const addComponent = {
            _id: component._id,
            classId: component.classId,
            name: component.name,
            description: component.description,
            className: found.name,
            classCourse: found.course
        }
        msg.push(addComponent)
    })
    return res.send(msg);
}



async function saveComponent(req, res) {
    const classId = req.sanitize('classId').escape();
    const name = req.sanitize('name').escape();
    const description = req.sanitize('description').escape();
    const component = await new ComponentModel({
        classId: classId,
        name: name,
        description: description,
    })
    const saveComponent = await component.save();
    if (!saveComponent) return res.status(400).send({ msg: "dados inválidos", status:400 });
    return res.status(201).send({ msg: "componente guardada", status:201 });
}


async function updateComponent(req, res) {
    const name = req.sanitize('name').escape();
    const description = req.sanitize('description').escape();
    const _id = req.sanitize('_id').escape();
    const component = await ComponentModel.findById(_id);
    if (!component) return res.status(404).send({ msg: "componente não encontrada", status:404 });
    await component.set(
        {
            name: name,
            description: description
        })
    const updateComponent = await component.save();
    if (!updateComponent) return res.status(400).send({ msg: "dados inválidos" , status:400});
    return res.status(200).send({ msg: "componente atualizada", status:200 });
}


async function deleteComponent(req, res) {
    const _id = req.sanitize('_id').escape();
    const component = await ComponentModel.findById(_id);
    if (!component) return res.status(404).send({ msg: "componente não encontrada", status:404 });
    const deleteComponent = await component.delete();
    if (!deleteComponent) return res.status(400).send({ msg: "dados invalidos", status:400 });
    return res.status(200).send({ msg: "componente apagada", status:200 });
}


async function saveComponentGrade(req, res) {
    const grade = req.sanitize('grade').escape();
    const studentId = req.sanitize('studentId').escape();
    const _id = req.sanitize('_id').escape();
    const component = await ComponentModel.findById(_id);
    if (!component) return res.status(404).send({ msg: "componente não encontrada", status:404 });
    const student = await StudentModel.findById(studentId);
    if (!student) return res.status(404).send({ msg: "studante não encontrado", status:404 });
    const found = component.grade.find(el => el._id == studentId)
    const studentGrade = {
        _id : student._id,
        email: student.email,
        name: student.name,
        student_number: student.student_number,
        grade: grade
    }
    if (found) {
        const index = component.grade.indexOf(found)
        component.grade[index] = studentGrade
    }
    else {
        component.grade.push(studentGrade)
    }
    const array = component.grade
    await component.set(
        {
            grade: []
        })
    const updateComponent = await component.save();
    if (!updateComponent) return res.status(400).send({ msg: "dados inválidos", status:400 });
    await component.set(
        {
            grade: array
        })
    const updateComponent2 = await component.save();
    if (!updateComponent2) return res.status(400).send({ msg: "dados invalidos", status:400 });
    return res.status(200).send({ msg: "componente atualizada", status:200 });
}





module.exports = {
    getComponentId: getComponentId,
    getComponents: getComponents,
    saveComponent: saveComponent,
    updateComponent: updateComponent,
    deleteComponent: deleteComponent,
    saveComponentGrade: saveComponentGrade,
    getComponentsByClasses : getComponentsByClasses

}