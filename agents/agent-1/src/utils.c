#include <wiringPi.h>
#include <stdio.h>
#include "../include/agent.h"
#include "../include/utils.h"
#include "../include/connections.h"


/*
 *
 */
void initialize(agent *agent)
{
    agent->id = 1; // This has to change between agents
    agent-> start_me = 0;
    agent->current_coordinates.x = -1;
    agent->current_coordinates.y = -1;

    agent->sem_status_to_lock[0] = 0;
    agent->sem_status_to_lock[1] = 0;
    agent->sem_status_to_lock[2] = 0;
    agent->sem_status_to_lock[3] = 0;




    agent->nodes[0][0].semaphores[0] = LED_00U; // up
    agent->nodes[0][0].semaphores[1] = LED_00R; // right
    agent->nodes[0][0].semaphores[2] = LED_00D; // down
    agent->nodes[0][0].semaphores[3] = LED_00L; // left
    agent->nodes[0][0].sensor = 0;
    agent->nodes[0][0].sem_locked = false; 
    agent->nodes[0][0].sem_status[0] = false; // up
    agent->nodes[0][0].sem_status[1] = false; // right
    agent->nodes[0][0].sem_status[2] = false; // down
    agent->nodes[0][0].sem_status[3] = false; // left

    agent->nodes[1][0].semaphores[0] = LED_10U;
    agent->nodes[1][0].semaphores[1] = LED_10R;
    agent->nodes[1][0].semaphores[2] = LED_10D;
    agent->nodes[1][0].semaphores[3] = LED_10L;
    agent->nodes[1][0].sensor = 1;
    agent->nodes[1][0].sem_locked = false; 
    agent->nodes[1][0].sem_status[0] = false; // up
    agent->nodes[1][0].sem_status[1] = false; // right
    agent->nodes[1][0].sem_status[2] = false; // down
    agent->nodes[1][0].sem_status[3] = false; // left


    agent->nodes[0][1].semaphores[0] = LED_01U;
    agent->nodes[0][1].semaphores[1] = LED_01R;
    agent->nodes[0][1].semaphores[2] = LED_01D;
    agent->nodes[0][1].semaphores[3] = LED_01L;
    agent->nodes[0][1].sensor = 2;
    agent->nodes[0][1].sem_locked = false; 
    agent->nodes[0][1].sem_status[0] = false; // up
    agent->nodes[0][1].sem_status[1] = false; // right
    agent->nodes[0][1].sem_status[2] = false; // down
    agent->nodes[0][1].sem_status[3] = false; // left


    agent->nodes[1][1].semaphores[0] = LED_11U; // up
    agent->nodes[1][1].semaphores[1] = LED_11R; // right
    agent->nodes[1][1].semaphores[2] = LED_11D; // down
    agent->nodes[1][1].semaphores[3] = LED_11L; // left
    agent->nodes[1][1].sensor = 3;
    agent->nodes[1][1].sem_locked = false; 
    agent->nodes[1][1].sem_status[0] = false; // up
    agent->nodes[1][1].sem_status[1] = false; // right
    agent->nodes[1][1].sem_status[2] = false; // down
    agent->nodes[1][1].sem_status[3] = false; // left


    agent->nodes[2][0].semaphores[0] = LED_20U;
    agent->nodes[2][0].semaphores[1] = LED_20R;
    agent->nodes[2][0].semaphores[2] = LED_20D;
    agent->nodes[2][0].semaphores[3] = LED_20L;
    agent->nodes[2][0].sensor = 4;
    agent->nodes[2][0].sem_locked = false; 
    agent->nodes[2][0].sem_status[0] = false; // up
    agent->nodes[2][0].sem_status[1] = false; // right
    agent->nodes[2][0].sem_status[2] = false; // down
    agent->nodes[2][0].sem_status[3] = false; // left


    agent->node_map[0].x = 0;
    agent->node_map[0].y = 0;

    agent->node_map[1].x = 1;
    agent->node_map[1].y = 0;

    agent->node_map[2].x = 0;
    agent->node_map[2].y = 1;

    agent->node_map[3].x = 1;
    agent->node_map[3].y = 1;

    agent->node_map[4].x = 2;
    agent->node_map[4].y = 0;
}

//Wrapper of digitalWrite from WiringPi for setting the boolean. It's thread-safe
void digitalWrite_wrapper(int pin, int value, bool *target){
    pthread_mutex_lock(&pins_mutex);
    digitalWrite(pin, value);
    pthread_mutex_unlock(&pins_mutex);
    *target = value;
}

