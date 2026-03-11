-- Create database



DROP DATABASE IF EXISTS Traffic_Lighter;



CREATE DATABASE Traffic_Lighter;



USE Traffic_Lighter;







-- Create the agents table



CREATE TABLE agents (



    agent_id INT PRIMARY KEY,  -- Identificador unico del agente



    start_me BOOL,             -- Indica que el agente ha de controlar un nodo



    finished BOOL,            -- Indica que el vehiculo ha pasado por el nodo que estaba controlando



    semaphore_up BOOLEAN,      -- Semaforo arriba



    semaphore_right BOOLEAN,   -- Semaforo derecha



    semaphore_down BOOLEAN,    -- Semaforo abajo



    semaphore_left BOOLEAN,     -- Semaforo izquierda



    x INT,                      -- Coordenadas del nodo por el que ha de pasar el vehiculo



    y INT



);







-- Crear la tabla de nodos con referencias a nodos adyacentes



CREATE TABLE nodes (



    server_x INT,              -- Coordenada X del nodo



    server_y INT,              -- Coordenada Y del nodo



    agent_id INT,              -- Identificador del agente



    semaphore_up BOOLEAN,      -- Semaforo arriba



    semaphore_right BOOLEAN,   -- Semaforo derecha



    semaphore_down BOOLEAN,    -- Semaforo abajo



    semaphore_left BOOLEAN,    -- Semaforo izquierda



    -- Referencias a los nodos adyacentes



    adjacent_down_x INT,



    adjacent_down_y INT,



    adjacent_right_x INT,



    adjacent_right_y INT,



    adjacent_up_x INT,



    adjacent_up_y INT,



    adjacent_left_x INT,



    adjacent_left_y INT,



    PRIMARY KEY (server_x, server_y),  -- Las coordenadas (x, y) seran la clave primaria



    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE,  -- Relacion con los agentes







    -- Claves foraneas a los nodos adyacentes



    FOREIGN KEY (adjacent_down_x, adjacent_down_y) REFERENCES nodes(server_x, server_y),  -- Nodo adyacente abajo



    FOREIGN KEY (adjacent_right_x, adjacent_right_y) REFERENCES nodes(server_x, server_y), -- Nodo adyacente derecha



    FOREIGN KEY (adjacent_up_x, adjacent_up_y) REFERENCES nodes(server_x, server_y),   -- Nodo adyacente arriba



    FOREIGN KEY (adjacent_left_x, adjacent_left_y) REFERENCES nodes(server_x, server_y)   -- Nodo adyacente izquierda



);







-- Table to store the agent's node map



CREATE TABLE agent_node_map (



    agent_id INT,            -- Foreign key to the agent



    x INT,                   -- X coordinate



    y INT,                   -- Y coordinate



    PRIMARY KEY (x, y, agent_id),   -- Primary key is composed of x, y coordinates and agent_id



    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE  -- Relationship with the agents table



);







CREATE TABLE coordinates_mapping (



    agent_id INT,                 -- Foreign key to the agent



    server_x INT,                 -- X coordinate in the server's coordinate system



    server_y INT,                 -- Y coordinate in the server's coordinate system



    agent_x INT,                  -- X coordinate in the agent's coordinate system



    agent_y INT,                  -- Y coordinate in the agent's coordinate system



    PRIMARY KEY (server_x, server_y),  -- Composite primary key (server coordinates)



    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE  -- Foreign key to the agents table



);







CREATE TABLE global (



    previouscoordinates_x INT,    -- previous X coordinate

    

    previouscoordinates_y INT,    -- previous Y coordinate



    actualcoordinates_x INT ,     -- X coordinate



    actualcoordinates_y INT,     -- Y coordinate

    

    nextcoordinates_x INT,       -- next X coordinate

    

    nextcoordinates_y INT,       -- next Y coordinate



    PRIMARY KEY (actualcoordinates_x, actualcoordinates_y)



);

CREATE TABLE statistics (



    id INT AUTO_INCREMENT,  



    start_time TIME DEFAULT NULL,



    stop_time  TIME DEFAULT NULL,


    PRIMARY KEY (id)
);





INSERT INTO agents (agent_id, start_me, finished, semaphore_up, semaphore_right, semaphore_down, semaphore_left, x, y)



VALUES 



(1, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 0, 0),



(2, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 0, 0);







-- Insertar los mapas de los agentes 1 y 2 (coordenadas de los nodos)



-- Mapa para el Agente 1



INSERT INTO agent_node_map (agent_id, x, y) VALUES



(1, 0, 0),



(1, 1, 0),



(1, 0, 1),



(1, 1, 1),



(1, 2, 0);







-- Mapa para el Agente 2 (mismo mapa)



INSERT INTO agent_node_map (agent_id, x, y) VALUES



(2, 0, 0),



(2, 1, 0),



(2, 0, 1),



(2, 1, 1),



(2, 2, 1);







-- Agente 1 (coordenadas locales a globales con desplazamiento (0, 2))



-- El Agente 1 tiene un desplazamiento de (0, 2)



INSERT INTO coordinates_mapping (agent_id, server_x, server_y, agent_x, agent_y) VALUES



(1, 0, 2, 0, 0),



(1, 1, 2, 1, 0),



(1, 0, 3, 0, 1),



(1, 1, 3, 1, 1),



(1, 2, 2, 2, 0);







INSERT INTO global (previouscoordinates_x, previouscoordinates_y, actualcoordinates_x, actualcoordinates_y, nextcoordinates_x, nextcoordinates_y) VALUES (-1, -1, -1 , -1, -1, -1);







-- Agente 2 (coordenadas locales a globales sin desplazamiento)



-- El Agente 2 mantiene las mismas coordenadas locales como globales



INSERT INTO coordinates_mapping (agent_id, server_x, server_y, agent_x, agent_y) VALUES



(2, 0, 0, 0, 0),



(2, 1, 0, 1, 0),



(2, 0, 1, 0, 1),



(2, 1, 1, 1, 1),



(2, 2, 1, 2, 1);







-- Nodo [0][2] del agente 1



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (0, 2, 1, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);







-- Nodo [0][3] del agente 1



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (0, 3, 1, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);







-- Nodo [1][2] del agente 1



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (1, 2, 1, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);







-- Nodo [1][3] del agente 1



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (1, 3, 1, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);







-- Nodo [2][2] del agente 1



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (2, 2, 1, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);















-- Nodo [0][0] del agente 2



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (0, 0, 2, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);







-- Nodo [0][1] del agente 2



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (0, 1, 2, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);







-- Nodo [1][0] del agente 2



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (1, 0, 2, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);







-- Nodo [1][1] del agente 2



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (1, 1, 2, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);







-- Nodo [2][1] del agente 2



INSERT INTO nodes (server_x, server_y, agent_id, adjacent_down_x, adjacent_down_y, adjacent_right_x, adjacent_right_y, adjacent_up_x, adjacent_up_y, adjacent_left_x, adjacent_left_y, semaphore_up, semaphore_right, semaphore_down, semaphore_left)



VALUES (2, 1, 2, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE);





-- AÃƒÆ’Ã‚Â±adir adyacentes (no se puede hacer antes porque estariamos haciendo referencia a nodos que aun no han sido creados)



-- Nodo [0][2] del agente 1



UPDATE nodes



SET adjacent_down_x = 0, adjacent_down_y = 1, adjacent_right_x = 1, adjacent_right_y = 2, adjacent_up_x = 0, adjacent_up_y = 3, adjacent_left_x = NULL, adjacent_left_y = NULL



WHERE server_x = 0 AND server_y = 2 AND agent_id = 1;







-- Nodo [0][3] del agente 1



UPDATE nodes



SET adjacent_down_x = 0, adjacent_down_y = 2, adjacent_right_x = 1, adjacent_right_y = 3, adjacent_up_x = NULL, adjacent_up_y = NULL, adjacent_left_x = NULL, adjacent_left_y = NULL



WHERE server_x = 0 AND server_y = 3 AND agent_id = 1;







-- Nodo [1][2] del agente 1



UPDATE nodes



SET adjacent_down_x = 1, adjacent_down_y = 1, adjacent_right_x = 2, adjacent_right_y = 2, adjacent_up_x = 1, adjacent_up_y = 3, adjacent_left_x = 0, adjacent_left_y = 2



WHERE server_x = 1 AND server_y = 2 AND agent_id = 1;







-- Nodo [1][3] del agente 1



UPDATE nodes



SET adjacent_down_x = 1, adjacent_down_y = 2, adjacent_right_x = NULL, adjacent_right_y = NULL, adjacent_up_x = NULL, adjacent_up_y = NULL, adjacent_left_x = 0, adjacent_left_y = 3



WHERE server_x = 1 AND server_y = 3 AND agent_id = 1;







-- Nodo [2][2] del agente 1



UPDATE nodes



SET adjacent_down_x = 2, adjacent_down_y = 1, adjacent_right_x = NULL, adjacent_right_y = NULL, adjacent_up_x = NULL, adjacent_up_y = NULL, adjacent_left_x = 1, adjacent_left_y = 2



WHERE server_x = 2 AND server_y = 2 AND agent_id = 1;











-- Nodo [0][0] del agente 2



UPDATE nodes



SET adjacent_down_x = NULL, adjacent_down_y = NULL, adjacent_right_x = 1, adjacent_right_y = 0, adjacent_up_x = 0, adjacent_up_y = 1, adjacent_left_x = NULL, adjacent_left_y = NULL



WHERE server_x = 0 AND server_y = 0 AND agent_id = 2;







-- Nodo [0][1] del agente 2



UPDATE nodes



SET adjacent_down_x = 0, adjacent_down_y = 0, adjacent_right_x = 1, adjacent_right_y = 1, adjacent_up_x = 0, adjacent_up_y = 2, adjacent_left_x = NULL, adjacent_left_y = NULL



WHERE server_x = 0 AND server_y = 1 AND agent_id = 2;







-- Nodo [1][0] del agente 2



UPDATE nodes



SET adjacent_down_x = NULL, adjacent_down_y = NULL, adjacent_right_x = NULL, adjacent_right_y = NULL, adjacent_up_x = 1, adjacent_up_y = 1, adjacent_left_x = 0, adjacent_left_y = 0



WHERE server_x = 1 AND server_y = 0 AND agent_id = 2;







-- Nodo [1][1] del agente 2



UPDATE nodes



SET adjacent_down_x = 1, adjacent_down_y = 0, adjacent_right_x = 2, adjacent_right_y = 1, adjacent_up_x = 1, adjacent_up_y = 2, adjacent_left_x = 0, adjacent_left_y = 1



WHERE server_x = 1 AND server_y = 1 AND agent_id = 2;







-- Nodo [2][1] del agente 2



UPDATE nodes



SET adjacent_down_x = NULL, adjacent_down_y = NULL, adjacent_right_x = NULL, adjacent_right_y = NULL, adjacent_up_x = 2, adjacent_up_y = 2, adjacent_left_x = 1, adjacent_left_y = 1



WHERE server_x = 2 AND server_y = 1 AND agent_id = 2;



















