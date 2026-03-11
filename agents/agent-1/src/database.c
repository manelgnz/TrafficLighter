#include <mariadb/mysql.h>
#include <stdio.h>
#include "../include/agent.h"
#include "../include/database.h"
#include "../include/utils.h"


bool get_data(MYSQL *conn, agent *agent)
{
    // Start the transaction
    if (mysql_query(conn, "START TRANSACTION"))
    {
        fprintf(stderr, "DATABASE: START TRANSACTION failed. Error: %s\n", mysql_error(conn));
        return false;
    }

    // Query to get the agent's data from the agents table
    char query[512];
    snprintf(query, sizeof(query), 
        "SELECT semaphore_up, semaphore_right, semaphore_down, semaphore_left, x, y FROM agents WHERE agent_id = %d", agent->id);

    // Execute the query
    if (mysql_query(conn, query))
    {
        fprintf(stderr, "DATABASE: SELECT failed. Error: %s\n", mysql_error(conn));
        mysql_query(conn, "ROLLBACK"); // Rollback on error
        return false;
    }

    // Get the result of the query
    MYSQL_RES *result = mysql_store_result(conn);
    if (result == NULL)
    {
        fprintf(stderr, "DATABASE: mysql_store_result failed. Error: %s\n", mysql_error(conn));
        mysql_query(conn, "ROLLBACK"); // Rollback on error
        return false;
    }

    // Check if there are rows (agent data exists)
    if (mysql_num_rows(result) == 0)
    {
        printf("DATABASE: No data found for agent %d\n", agent->id);
        fflush(stdout);
        mysql_free_result(result);
        mysql_query(conn, "COMMIT");
        return false; // No data found for agent
    }

    // Print and process the agent's data
    MYSQL_ROW row;
    bool semaphore_up, semaphore_right, semaphore_down, semaphore_left;
    int x, y;

    printf("DATABASE: Data for agent %d:\n", agent->id);
    fflush(stdout);

    // Fetch the data from the query result
    while ((row = mysql_fetch_row(result)))
    {
        fflush(stdout);
        semaphore_up = atoi(row[0]);
        semaphore_right = atoi(row[1]);
        semaphore_down = atoi(row[2]);
        semaphore_left = atoi(row[3]);
        x = atoi(row[4]);
        y = atoi(row[5]);
        // Assign the data to the agent structure
        agent->sem_status_to_lock[0] = semaphore_up;
        agent->sem_status_to_lock[1] = semaphore_right;
        agent->sem_status_to_lock[2] = semaphore_down;
        agent->sem_status_to_lock[3] = semaphore_left;
        agent->current_coordinates.x = x;
        agent->current_coordinates.y = y;

        printf("Node (%d, %d): Semaphores up: %d, right: %d, down: %d, left: %d\n", 
            x, y, semaphore_up, semaphore_right, semaphore_down, semaphore_left);
        fflush(stdout);
    }

    // Free the result
    mysql_free_result(result);

    // Commit the transaction
    if (mysql_query(conn, "COMMIT"))
    {
        fprintf(stderr, "DATABASE: Failed to COMMIT. Error: %s\n", mysql_error(conn));
        return false;
    }

    printf("DATABASE: Data successfully obtained for agent %d\n", agent->id);
    fflush(stdout);
    return true; // Data found and processed
}


void get_start_me(MYSQL *conn, agent *agent){

    char query[512];
    snprintf(query, sizeof(query), 
        "SELECT start_me FROM agents WHERE agent_id = %d", agent->id);

    // Execute the query
    if (mysql_query(conn, query))
    {
        fprintf(stderr, "DATABASE: SELECT failed. Error: %s\n", mysql_error(conn));
    }

    // Get the result of the query
    MYSQL_RES *result = mysql_store_result(conn);
    if (result == NULL)
    {
        fprintf(stderr, "DATABASE: mysql_store_result failed. Error: %s\n", mysql_error(conn));
    }

    agent->start_me = atoi(mysql_fetch_row(result)[0]);

    // Free the result
    mysql_free_result(result);


    printf("DATABASE: Start_me successfully obtained: %d\n", agent->start_me);
    fflush(stdout);

}




void update_all_semaphores(MYSQL *conn, agent *agent) {
    char query[512];

    // Start a transaction
    if (mysql_query(conn, "START TRANSACTION")) {
        fprintf(stderr, "DATABASE: Transaction start failed. Error: %s\n", mysql_error(conn));
        return;
    }

    // Iterate through all nodes in the agent's node_map
    for (int i = 0; i < MAX_NODE; i++) {
        int agent_x = agent->node_map[i].x; // X coordinate of the node from node_map
        int agent_y = agent->node_map[i].y; // Y coordinate of the node from node_map

        // Retrieve semaphore status data from the agent's local map
        pthread_mutex_lock(&sem_mutex);
        bool semaphore_up = agent->nodes[agent_x][agent_y].sem_status[0];   // Semaphore up
        bool semaphore_right = agent->nodes[agent_x][agent_y].sem_status[1]; // Semaphore right
        bool semaphore_down = agent->nodes[agent_x][agent_y].sem_status[2]; // Semaphore down
        bool semaphore_left = agent->nodes[agent_x][agent_y].sem_status[3]; // Semaphore left
        pthread_mutex_unlock(&sem_mutex);
        // Build the SQL query to update the semaphores for the node
        snprintf(query, sizeof(query),
                 "UPDATE nodes n "
                 "JOIN coordinates_mapping cm ON n.server_x = cm.server_x AND n.server_y = cm.server_y "
                 "SET n.semaphore_up = %d, "
                 "    n.semaphore_right = %d, "
                 "    n.semaphore_down = %d, "
                 "    n.semaphore_left = %d "
                 "WHERE cm.agent_id = %d AND cm.agent_x = %d AND cm.agent_y = %d",
                 semaphore_up, semaphore_right, semaphore_down, semaphore_left,
                 agent->id, agent_x, agent_y);

        // Execute the query
        if (mysql_query(conn, query)) {
            fprintf(stderr, "DATABASE: UPDATE failed for semaphores of agent (%d, %d). Error: %s\n",
                    agent_x, agent_y, mysql_error(conn));

            // If there is an error, rollback the transaction and exit
            if (mysql_query(conn, "ROLLBACK")) {
                fprintf(stderr, "DATABASE: Transaction rollback failed. Error: %s\n", mysql_error(conn));
            }
            return; // Exit the function if the update fails
        }

        // Confirm the update success
        printf("DATABASE: Semaphores updated for node with agent coordinates (%d, %d).\n",
               agent_x, agent_y);
        fflush(stdout);
    }

    // Commit the transaction if all updates are successful
    if (mysql_query(conn, "COMMIT")) {
        fprintf(stderr, "DATABASE: Transaction commit failed. Error: %s\n", mysql_error(conn));
    } else {
        printf("DATABASE: Transaction committed successfully.\n");
        fflush(stdout);
    }
}

void update_agent_status(MYSQL *conn, agent *agent) {
    char query[512];
    
    // Prepara la consulta para actualizar ambos campos en la misma fila
    snprintf(query, sizeof(query), 
             "UPDATE agents SET finished = 1, start_me = FALSE WHERE agent_id = %d", 
             agent->id);

    // Ejecuta la consulta
    if (mysql_query(conn, query)) {
        fprintf(stderr, "DATABASE: UPDATE failed. Error: %s\n", mysql_error(conn));
    }

    // Confirmación de la actualización
    printf("DATABASE: 'finished' set to 1 and 'start_me' set to FALSE for agent_id = %d\n", agent->id);
    fflush(stdout);
}

/*
 * Initialize and stablishes a connection to database
 */
MYSQL *initialize_BD()
{

    MYSQL *conn;

    conn = mysql_init(NULL);
    if (conn == NULL)
    {
        fprintf(stderr, "mysql_init() failed\n");
        exit(1);
    }

    if (mysql_real_connect(conn, "192.168.0.6", "agent1", "0000", "Traffic_Lighter", 0, NULL, 0) == NULL)
    {
        fprintf(stderr, "mysql_real_connect() failed\n");
        mysql_close(conn);
        exit(1);
    }
    return conn;
}




