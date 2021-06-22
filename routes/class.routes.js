const router = require('express').Router();
const classController = require("../controllers/class.controller.js")

router.get('/classes/:_id', classController.getClassId) 
router.get('/classes', classController.getClasses) 
router.post('/classes', classController.saveClass) 
router.put('/classes/:_id', classController.updateClass) 
router.delete('/classes/:_id', classController.deleteClass) 
module.exports = router;
