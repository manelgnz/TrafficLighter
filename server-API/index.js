const express = require('express');
const bodyParser = require('body-parser');
const nodeRoutes = require('./nodes/node.routes.js');
const cors = require('cors');

const app = express(); 
const PORT = 3000;

app.use(cors()); 
app.use(bodyParser.json()); // Parse JSON from the request body

app.use('/api/nodes', nodeRoutes); // Redirect all the requests starting with /api/nodes to nodeRoutes

app.listen(PORT, () => { 
    console.log(`Server running at http://localhost:${PORT}`); 
});