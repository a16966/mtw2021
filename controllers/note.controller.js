const NoteModel = require("../models/note")
const StudentModel = require("../models/student")
const ClassModel = require("../models/class.js")

async function getNoteId(req, res) {
    const _id = req.sanitize('_id').escape();
    const note = await NoteModel.findById(_id);
    if (!note) return res.status(404).send({ msg: "nota não encontrada", status: 404 });
    res.send(note);
}

async function getStudentsNotes(req, res) {
    const notes = await NoteModel.find({ studentId: { $exists: true, $ne: null } }, {
        _id: 1,
        studentId: 1,
        description: 1,
        date: 1
    });
    if (!notes) return res.status(404).send({ msg: "notas não encontrada", status: 404 });
    const students = await StudentModel.find({}, {
        _id: 1,
        name: 1,
        student_number: 1
    });
    if (!students) return res.status(404).send({ msg: "estudantes não encontrado", status: 404 });
    const msg = []
    notes.forEach(async function (note) {
        const found = students.find(el => el._id == note.studentId);
        if (!found) return
        const addNote = {
            _id: note._id,
            studentId: note.studentId,
            description: note.description,
            date: note.date,
            studentName: found.name,
            studentNumber: found.student_number
        }
        msg.push(addNote)
    })
    return res.send(msg);
}

async function getClassesNotes(req, res) {
    const notes = await NoteModel.find({ classId: { $exists: true, $ne: null } }, {
        _id: 1,
        classId: 1,
        description: 1,
        date: 1
    });
    if (!notes) return res.status(404).send({ msg: "notas não encontrada", status: 404 });
    const classes = await ClassModel.find({}, {
        _id: 1,
        name: 1,
        course: 1
    });
    if (!classes) return res.status(404).send({ msg: "classes não encontradas", status: 404 });
    const msg = []
    notes.forEach(async function (note) {
        const found = classes.find(el => el._id == note.classId);
        if (!found) return
        const addNote = {
            _id: note._id,
            studentId: note.studentId,
            description: note.description,
            date: note.date,
            className: found.name,
            classCourse: found.course
        }
        msg.push(addNote)
    })
    return res.send(msg);
}

async function saveStudentNote(req, res) {
    const studentId = req.sanitize('studentId').escape();
    const description = req.sanitize('description').escape();
    const note = await new NoteModel({
        studentId: studentId,
        description: description,
    })
    const saveNote = await note.save();
    if (!saveNote) return res.status(400).send({ msg: "dados inválidos", status: 400 });
    return res.status(201).send({ msg: "nota guardada", status: 201 });
}

async function saveClassNote(req, res) {
    const classId = req.sanitize('classId').escape();
    const description = req.sanitize('description').escape();
    const note = await new NoteModel({
        classId: classId,
        description: description,
    })
    const saveNote = await note.save();
    if (!saveNote) return res.status(400).send({ msg: "dados inválidos", status: 400 });
    return res.status(201).send({ msg: "nota guardada", status: 201 });
}

async function updateNote(req, res) {
    const description = req.sanitize('description').escape();
    const _id = req.sanitize('_id').escape();
    const note = await NoteModel.findById(_id);
    if (!note) return res.status(404).send({ msg: "nota não encontrada", status: 404 });
    await note.set(
        {
            description: description,
        })
    const updateNote = await note.save();
    if (!updateNote) return res.status(400).send({ msg: "dados invalidos", status: 400 });
    return res.status(200).send({ msg: "nota atualizada", status: 200 });
}

async function deleteNote(req, res) {
    const _id = req.sanitize('_id').escape();
    const note = await NoteModel.findById(_id);
    if (!note) return res.status(404).send({ msg: "nota não encontrada", status: 404 });
    const deleteNote = await note.delete();
    if (!deleteNote) return res.status(400).send({ msg: "dados inválidos", status: 400 });
    return res.status(200).send({ msg: "nota apagada", status: 200 });
}

module.exports = {
    getNoteId: getNoteId,
    getStudentsNotes: getStudentsNotes,
    getClassesNotes: getClassesNotes,
    saveStudentNote: saveStudentNote,
    saveClassNote: saveClassNote,
    updateNote: updateNote,
    deleteNote: deleteNote
}