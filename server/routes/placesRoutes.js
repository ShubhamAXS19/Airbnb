const express = require('express')
const router = express.Router()



router.route('/places').get(getPlace).post(createPlace)