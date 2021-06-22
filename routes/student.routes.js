const router = require('express').Router();
const configMulter = require("../config/multer.js")
const studentController = require("../controllers/student.controller.js")


router.post('/classes/:_id/upload-students', configMulter.uploadCSVToMemory, studentController.saveStudents)
router.get('/students/:_id', studentController.getStudentId) 
router.get('/students', studentController.getStudents) 
router.get('/classes/:_id/students', studentController.getStudentsPerClass)





module.exports = router;