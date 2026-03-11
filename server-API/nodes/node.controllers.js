const { NodeModel } = require('./node.model.js');

// Function to get all nodes from the database
const getAllNodes = async (req, res) => {
    try {
        const nodes = await NodeModel.getAllNodes();
        res.status(200).json(nodes);
    } catch (error) {
        console.error('Error al obtener nodos:', error);
        res.status(500).json({ error: 'Error al obtener nodos' });
    }
};

// Function to get the actual coordinate of the ambulance
const getActualCoordinate = async (req, res) => {
    try {
        const positions = await NodeModel.getActualCoordinate(); // Get the actual coordinate of the ambulance
        if (positions && positions.length > 0) {
            res.status(200).json(positions); // Return the positions as JSON
        } else {
            res.status(404).json({ message: 'No ambulance coordinates found.' });
        }
    } catch (error) {
        console.error('Error getting ambulance position:', error);
        res.status(500).json({ message: 'Error getting ambulance position.' });
    }
};

// Function to get the time of the ambulance
const getTime = async (req, res) => {
    try {
        const time = await NodeModel.getTime(); // Obtain the time of the ambulance
        if (time && time.length > 0) {
            res.status(200).json(time); // Return the time as JSON
        } else {
            res.status(404).json({ message: 'No ambulance times found.' });
        }
    } catch (error) {
        console.error('Error getting ambulance time:', error);
        res.status(500).json({ message: 'Error getting ambulance time.' });
    }
};

// Function to calculate the route of the ambulance
const calculateRoute = async (req, res) => {
    const { initialX, initialY, finalX, finalY } = req.body; // Get the initial and final coordinates from the request body

    console.log('Received coordinates:', { initialX, initialY, finalX, finalY });
    
    let now = new Date(); // Get the current date and time

    const starting_time = now.toTimeString().split(' ')[0]; // Save the starting time as HH:MM:SS

    const initialExists = await NodeModel.coordinatesExist(initialX, initialY); // Check if the initial coordinates exist
    if (!initialExists) {
        return res.status(404).json({ error: 'Initial coordinates not found on the map.' });
    }

    const finalExists = await NodeModel.coordinatesExist(finalX, finalY); // Check if the final coordinates exist
    if (!finalExists) {
        return res.status(404).json({ error: 'Final coordinates not found on the map.' });
    }

    const startNode = { x: initialX, y: initialY, g: 0, h: 0, f: 0, parent: null }; 
    const endNode = { x: finalX, y: finalY };   

    //Heuristic function to calculate the Manhattan distance
    const heuristic = (node) => Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y);

    // A* algorithm
    let openSet = [startNode]; // Amount of nodes to be evaluated
    let closedSet = []; // Amount of nodes already evaluated
    const route = []; // Route to be followed by the ambulance

    let currentNode; 
    do {

        if (openSet.length <= 0) {
            console.log('Empty route:', route);
            return res.status(404).json({ error: 'No valid route found.' }); 
        }

        // Select the node with the lowest f value
        let currentIndex = 0;
        for (let i = 1; i < openSet.length; i++) { // Start from 1 to avoid the first element
            if (openSet[i].f < openSet[currentIndex].f) { // Compare the f values
                currentIndex = i; // Update the index of the node with the lowest f value
            }
        }

        currentNode = openSet[currentIndex]; // Select the node with the lowest f value

        // Move the current node from the open set to the closed set
        openSet.splice(currentIndex, 1); // Remove the current node from the open set
        closedSet.push(currentNode); // Add the current node to the closed set

        // Generate the neighbors of the current node
        const neighbors = [ // Up, Right, Down, Left
            { x: currentNode.x + 1, y: currentNode.y },
            { x: currentNode.x - 1, y: currentNode.y },
            { x: currentNode.x, y: currentNode.y + 1 },
            { x: currentNode.x, y: currentNode.y - 1 }
        ];

        for (const neighbor of neighbors) {
            // Check if the neighbor is in the closed set
            if (closedSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) { // Check if the node is in the closed set
                continue;
            }

            // Check if the neighbor is in the open set
            const exists = await NodeModel.coordinatesExist(neighbor.x, neighbor.y);
            if (!exists) continue; // Skip if the node does not exist

            // Calculate the f, g, and h values
            const g = currentNode.g + 1;
            const h = heuristic(neighbor);
            const f = g + h;

            // If the neighbor is already in the open set and the new g value is higher, skip
            const openNode = openSet.find(node => node.x === neighbor.x && node.y === neighbor.y);
            if (openNode && g >= openNode.g) {
                continue;
            }

            // Add or update the neighbor in the open set
            neighbor.g = g;
            neighbor.h = h;
            neighbor.f = f;
            neighbor.parent = currentNode;

            if (!openNode) { // If the neighbor is not in the open set, add it
                openSet.push(neighbor);
            }
        }
    } while (currentNode.x !== endNode.x || currentNode.y !== endNode.y); // Repeat until the current node is the end node

    let current = currentNode; // Start from the end node
    while (current) {
        route.push({ x: current.x, y: current.y }); // Add the current node to the route
        current = current.parent; // Move to the parent node
    }
    route.reverse(); // Reverse the route to get the correct order
    console.log('Calculated route:', route);

    // Obtain the order of the agents based on the route
    let agentOrder = [];
    agentOrder = await NodeModel.getAgentOrder(route, agentOrder);
    let i = 1;

    // Iterate over the route to update the semaphore status
    while (i < agentOrder.length-1) { // Includes the last agent as well
        console.log(`\nStarting verification for agent ${agentOrder[i]}`);
    
        const previousCoordinates = route[i - 1];
        const currentCoordinates = route[i];
        const nextCoordinates = i < agentOrder.length - 1 ? route[i + 1] : null; // Handle the last agent
    
        console.log(`[DEBUG] Previous coordinates: (${previousCoordinates.x}, ${previousCoordinates.y})`);
        console.log(`[DEBUG] Current coordinates: (${currentCoordinates.x}, ${currentCoordinates.y})`);
        if (nextCoordinates) {
            console.log(`[DEBUG] Next coordinates: (${nextCoordinates.x}, ${nextCoordinates.y})`);
        }
    
        // Direction from previous to current
        const fromDirection = {
            x: previousCoordinates.x - currentCoordinates.x,
            y: previousCoordinates.y - currentCoordinates.y
        };
    
        // Direction from current to next (if not the last agent)
        const toDirection = nextCoordinates
            ? {
                  x: nextCoordinates.x - currentCoordinates.x,
                  y: nextCoordinates.y - currentCoordinates.y
              }
            : { x: 0, y: 0 }; // No direction in the last case
    
        console.log(`[DEBUG] fromDirection: (${fromDirection.x}, ${fromDirection.y})`);
        console.log(`[DEBUG] toDirection: (${toDirection.x}, ${toDirection.y})`);
    
        // Current semaphores
        const semaphoresTurnOn = [false, false, false, false];
    
        const turnOnSemaphore = (direction) => {
            if (direction.x > 0 && direction.y === 0) {
                semaphoresTurnOn[1] = true;
                console.log("[DEBUG] Turning on semaphore: Right");
            } else if (direction.x < 0 && direction.y === 0) {
                semaphoresTurnOn[3] = true;
                console.log("[DEBUG] Turning on semaphore: Left");
            } else if (direction.y > 0 && direction.x === 0) {
                semaphoresTurnOn[0] = true;
                console.log("[DEBUG] Turning on semaphore: Up");
            } else if (direction.y < 0 && direction.x === 0) {
                semaphoresTurnOn[2] = true;
                console.log("[DEBUG] Turning on semaphore: Down");
            }
        };
    
        console.log("[DEBUG] Turning on semaphores based on fromDirection and toDirection:");
        turnOnSemaphore(fromDirection);
        turnOnSemaphore(toDirection);
    
        console.log(`[INFO] Semaphores turned on at currentCoordinates: [Up: ${semaphoresTurnOn[0]}, Right: ${semaphoresTurnOn[1]}, Down: ${semaphoresTurnOn[2]}, Left: ${semaphoresTurnOn[3]}]`);
    
        console.log("[DEBUG] Updating semaphores in the database.");
        await NodeModel.setSemaphoreStatus(agentOrder[i], semaphoresTurnOn);
    
        await NodeModel.setStart(agentOrder[i], currentCoordinates.x, currentCoordinates.y);
    
        while ((await NodeModel.getAgentStatus(agentOrder[i])).finished === 0) {
            console.log("Waiting for the involved agent to detect the vehicle");
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    
        // Update coordinates where the vehicle has just passed
        if (i > 0 && (nextCoordinates || i === agentOrder.length - 1)) {
            await NodeModel.updateCoordinates(
                previousCoordinates.x,
                previousCoordinates.y,
                currentCoordinates.x,
                currentCoordinates.y,
                nextCoordinates ? nextCoordinates.x : currentCoordinates.x, // For the last agent, nextCoordinates equals currentCoordinates
                nextCoordinates ? nextCoordinates.y : currentCoordinates.y
            );
            console.log(`[DEBUG] Updating coordinates in the database.`);
        }
    
        await NodeModel.setFinishedFalse(agentOrder[i]);
        console.log(`Verification completed for agent ${agentOrder[i]}`);
        i++;
    }
    now = new Date(); // Get the current date and time
    console.log(`The vehicle finished the route`);
    const ending_time = now.toTimeString().split(' ')[0]; // Format HH:MM:SS
    await NodeModel.setTime(starting_time, ending_time); // Update the time in the database
    await new Promise(resolve => setTimeout(resolve, 4000));    // Wait for the animation to complete
    // Avoid drawing the animation again
    await NodeModel.updateCoordinates(
        -1,
        -1,
        -1,
        -1,
        -1, 
        -1
    );
    return res.json({ route });
};
    

module.exports = { getAllNodes, calculateRoute, getActualCoordinate, getTime };