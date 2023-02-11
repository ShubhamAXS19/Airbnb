const express = require('express')
const router = express.Router()
const { register, login, logout, profile } = require('../controllers/authController')


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/profile').post(profile)
router.route('/logout').post(logout)

module.exports = router