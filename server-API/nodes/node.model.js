const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'traffic_lighter',
});

const NodeModel = {

    // SQL query to get all nodes from the database
    async getAllNodes() {
        const [rows] = await db.query('SELECT * FROM nodes');
        return rows;
    },

    // SQL query to get the coordinates of the actual node
    async coordinatesExist(serverX, serverY) {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM coordinates_mapping WHERE server_x = ? AND server_y = ?', [serverX, serverY]);
        return rows[0].count > 0;
    },

    // SQL query to check if the coordinates are adjacent
    async areCoordinatesAdjacent(initialX, initialY, finalX, finalY) {
        const [rows] = await db.query(`
            SELECT COUNT(*) as count FROM nodes 
            WHERE server_x = ? AND server_y = ? 
            AND (
                (adjacent_up_x = ? AND adjacent_up_y = ?) OR
                (adjacent_down_x = ? AND adjacent_down_y = ?) OR
                (adjacent_left_x = ? AND adjacent_left_y = ?) OR
                (adjacent_right_x = ? AND adjacent_right_y = ?)
            )
        `, [initialX, initialY, finalX, finalY, finalX, finalY, finalX, finalY, finalX, finalY]);

        return rows[0].count > 0;
    },

    // SQL query to get the agents based on the coordinates
    async getAgentsByCoordinates(x, y) {
        const [result] = await db.query(
            'SELECT agent_id FROM nodes WHERE server_x = ? AND server_y = ?',
            [x, y]
        );
        return result;
    },

    // SQL query to get the finished value of an agent
    async getAgentStatus(agentId) {
        const [rows] = await db.query('SELECT finished FROM agents WHERE agent_id = ?', [agentId]); 
        console.log(`Rows obtained for agent ${agentId}:`, rows);

        if (rows.length === 0) {
            console.error(`No agent found with ID ${agentId}`);
            return { finished: undefined };
        }
        return rows[0]; // Returns the first object from the rows
    },

    // SQL query to get the actual coordinate
    async getActualCoordinate() {
        const [rows] = await db.query("SELECT previouscoordinates_x, previouscoordinates_y, actualcoordinates_x, actualcoordinates_y, nextcoordinates_x, nextcoordinates_y FROM global");

        if (rows.length === 0) { // If there are no rows, return null
            return null;
        }

        // Extract all coordinates and convert them into objects
        const coordinates = rows.map(row => {
            return {
                previous: { x: row.previouscoordinates_x, y: row.previouscoordinates_y },
                actual: { x: row.actualcoordinates_x, y: row.actualcoordinates_y },
                next: { x: row.nextcoordinates_x, y: row.nextcoordinates_y }
            }; // Now includes 'previous', 'actual', and 'next'
        });

        return coordinates; // Returns an array of objects with 'previous', 'actual', and 'next'
    },

    // SQL query to get the starting and ending time from the database
    async getTime() {
        const [rows] = await db.query('SELECT * FROM statistics');
        return rows;
    },

    // SQL query to get the agent's order based on the route
    async getAgentOrder(route, agentOrder) {

        for (const point of route) {
            const { x, y } = point;
    
            // Get agents associated with the coordinates (x, y)
            const agents = await NodeModel.getAgentsByCoordinates(x, y);
    
            for (const agent of agents) { // For each agent, get the agent_id
                const agentId = agent.agent_id; 
                agentOrder.push(agentId); // Add the agent_id to the agentOrder array
            }
        }
        console.log('Agent order:', Array.from(agentOrder));  
        return agentOrder;
    },

    // SQL query to change the start_me value
    async setStart(agentId, serverX, serverY) { 
        try {
            // Execute the query to get the agent's coordinates
            const [rows] = await db.query(`
                SELECT cm.agent_x, cm.agent_y
                FROM coordinates_mapping cm
                WHERE cm.server_x = ? AND cm.server_y = ? AND cm.agent_id = ?
            `, [serverX, serverY, agentId]);
    
            if (rows.length > 0) {
                // Get the agent's coordinates
                const { agent_x, agent_y } = rows[0];
    
                // Execute the SQL query to update the agent's coordinates and set start_me to true
                const query = `
                    UPDATE agents
                    SET start_me = ?, x = ?, y = ?
                    WHERE agent_id = ?
                `;
                const [updateResult] = await db.query(query, [true, agent_x, agent_y, agentId]);
    
                if (updateResult.affectedRows > 0) {
                    console.log(`Agent ${agentId} has started at coordinates (${agent_x}, ${agent_y}).`);
                } else {
                    console.log(`No data found for agent ${agentId} or the start_me field was not updated.`);
                }
            } else {
                console.log(`No mapped coordinates found for agent ${agentId} with server coordinates (${serverX}, ${serverY}).`);
            }
        } catch (error) {
            console.error('Error updating the agent start:', error);
        }
    },

    // SQL query to stablish the semaphore's colour
    async setSemaphoreStatus(agentId, semaphoresTurnOn) {
        // Build the semaphore update
        const updates = {
            semaphore_up:    semaphoresTurnOn[0],
            semaphore_right: semaphoresTurnOn[1],
            semaphore_down:  semaphoresTurnOn[2],
            semaphore_left:  semaphoresTurnOn[3],
        };
    
        // Execute the SQL query to update the agent's semaphores
        const [rows] = await db.query(`
            UPDATE agents
            SET semaphore_up = ?, semaphore_right = ?, semaphore_down = ?, semaphore_left = ?
            WHERE agent_id = ?
        `, [updates.semaphore_up, updates.semaphore_right, updates.semaphore_down, updates.semaphore_left, agentId]);
    
        if (rows.affectedRows > 0) {
            console.log(`Semaphores for agent ${agentId} updated successfully.`);
        } else {
            console.log(`No data found for agent ${agentId} or semaphores were not updated.`);
        }
    },

    // SQL query to update the coordinates to the database
    async updateCoordinates(previousX, previousY, actualX, actualY, nextX, nextY) {
        try {
            // SQL query to update previous, actual, and next coordinates
            const query = `
                UPDATE global
                SET previouscoordinates_x = ?, previouscoordinates_y = ?, 
                    actualcoordinates_x = ?, actualcoordinates_y = ?, 
                    nextcoordinates_x = ?, nextcoordinates_y = ?`;
    
            // Execute the query with the provided values
            const [result] = await db.query(query, [previousX, previousY, actualX, actualY, nextX, nextY, actualX, actualY]);
    
            if (result.affectedRows > 0) {
                console.log(`Coordinates updated: 
                            Previous: (${previousX}, ${previousY}), 
                            Actual: (${actualX}, ${actualY}), 
                            Next: (${nextX}, ${nextY}).`);
            } else {
                console.log('Could not update coordinates. Make sure there is a record with the actual coordinates.');
            }
        } catch (error) {
            console.error('Error updating coordinates:', error);
        }
    },

    // SQL query to change the finished value to false
    async setFinishedFalse(agentId) {
        const [rows] = await db.query("UPDATE agents SET finished =? WHERE agent_id =?", [false, agentId]);
        if (rows.affectedRows > 0) {
            console.log(`The status of agent ${agentId} has been updated to false.`);
        } else {
            console.log(`The status of agent ${agentId} was not updated.`);
        }
    },

    // SQL query to update the agent's coordinates
    async setTime(start_time, stop_time) {
        const [rows] = await db.query('INSERT INTO statistics (start_time, stop_time) VALUES (?, ?)', [start_time, stop_time]);
        if (rows.affectedRows > 0) {
            console.log(`Time updated successfully.`);
        } else {
            console.log(`Time was not updated.`);
        }
    },
}
module.exports = { NodeModel };
