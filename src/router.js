const express = require('express')
const userController = require('./controllers/userController')
const sectorController = require('./controllers/sectorController')
const jobController = require('./controllers/jobController')
const auth = require('./middlewares/auth')
const authController = require('./controllers/authController')

const router = express.Router()

router.get('/user', userController.getUsers)
router.get('/user/:id',  userController.getUser)
router.put('/user/', auth, userController.createUser)
router.patch('/user/', auth, userController.editUser)
router.delete('/user/', auth, userController.deleteUser)
router.post('/user/login', authController)


router.get('/sector', sectorController.getSectors)
router.get('/sector/:id', sectorController.getSector)
router.put('/sector/', sectorController.createSector)
router.patch('/sector/', sectorController.editSector)
router.delete('/sector/', sectorController.deleteSector)


router.get('/job', jobController.getJobs)
router.get('/job/:id', jobController.getJob)
router.put('/job/', jobController.createJob)
router.patch('/job/', jobController.editJob)
router.delete('/job/', jobController.deleteJob)

module.exports = router