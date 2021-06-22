const ClassModel = require("../models/class.js")
const ComponentModel = require("../models/component.js")


async function getClassId(req, res) {
    const _id = req.sanitize('_id').escape();
    const classe = await ClassModel.findById(_id);
    if (!classe) return res.status(404).send({ msg: "UC não encontrada", status:404 });
    let components = await ComponentModel.find({classId:_id}, {
        _id : 1,
        name: 1,
        description: 1,
        grade: 1
    })
    if (!classe) components = []
    res.send({class: classe, components : components});
}


async function getClasses(req, res) {
    const classe = await ClassModel.find({}, {
        _id : 1,
        course: 1,
        name: 1,
        year: 1,
        description: 1

    });
    if (!classe) return res.status(404).send({ msg: "UC não encontrada", status:404 });
    return res.send(classe);
}

async function saveClass(req, res) {
    const course = req.sanitize('course').escape();
    const name = req.body.name;
    const year = req.sanitize('year').escape();
    const description = req.body.description;
    const classe = await new ClassModel({
        course: course,
        name: name,
        description: description,
        year: year
    })
    const saveClass = await classe.save();
    if (!saveClass) return res.status(400).send({ msg: "dados inválidos", status:400});
    return res.status(201).send({ msg: "UC guardada", status:201 });
}


async function updateClass(req, res) {
    const course = req.sanitize('course').escape();
    const name = req.body.name;
    const year = req.sanitize('year').escape();
    const description = req.body.description;
    const _id = req.sanitize('_id').escape();
    const classe = await ClassModel.findById(_id);
    if (!classe) return res.status(404).send({ msg: "UC não encontrada", status:404 });
    await classe.set(
        {course: course,
        name: name,
        description: description,
        year: year
    })
    const updateClass = await classe.save();
    if (!updateClass) return res.status(400).send({ msg: "dados inválidos", status:400 });
    return res.status(200).send({ msg: "UC atualizada", status:200 });
}


async function deleteClass(req, res) {
    const _id = req.sanitize('_id').escape();
    const classe = await ClassModel.findById(_id);
    if (!classe) return res.status(404).send({ msg: "UC não encontrada" , status:404 });
    const deleteClass = await classe.delete();
    if (!deleteClass) return res.status(400).send({ msg: "dados inválidos", status:400 });
    return res.status(200).send({ msg: "UC apagada", status:200 });
}




module.exports = {
    getClassId: getClassId,
    getClasses: getClasses,
    saveClass: saveClass,
    updateClass: updateClass,
    deleteClass: deleteClass

}