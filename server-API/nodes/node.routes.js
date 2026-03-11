const express = require('express');
const { getAllNodes, calculateRoute, getActualCoordinate, getTime } = require('./node.controllers.js');

const router = express.Router();

router.get('/', getAllNodes);
router.get('/coordinates', getActualCoordinate);
router.get('/time', getTime); 
router.post('/route', calculateRoute); 

module.exports = router;
