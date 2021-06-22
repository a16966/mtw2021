const router = require('express').Router();
const componentController = require("../controllers/component.controller.js")



router.get('/components/:_id', componentController.getComponentId) 
router.get('/components', componentController.getComponents) 
router.post('/components', componentController.saveComponent) 
router.put('/components/:_id', componentController.updateComponent) 
router.delete('/components/:_id', componentController.deleteComponent) 
router.post('/components/:_id/student/:studentId/grades', componentController.saveComponentGrade) 

module.exports = router;
