const router = require('express').Router();
const noteController = require("../controllers/note.controller.js")



router.get('/notes/:_id', noteController.getNoteId) 
router.get('/students-notes', noteController.getStudentsNotes) 
router.get('/classes-notes', noteController.getClassesNotes) 
router.post('/classes/:classId/notes', noteController.saveClassNote) 
router.post('/students/:studentId/notes', noteController.saveStudentNote)
router.put('/notes/:_id', noteController.updateNote) 
router.delete('/notes/:_id', noteController.deleteNote) 

module.exports = router;