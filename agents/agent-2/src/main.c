#include <wiringPi.h>
#include <stdio.h>
#include <pthread.h>
#include "../include/agent.h"
#include "../include/database.h"
#include "../include/utils.h"
#include "../include/connections.h"
#include "../include/tasks.h"

int refresh = 250000;
pthread_mutex_t sem_mutex = PTHREAD_MUTEX_INITIALIZER;  // protects from modifying same value of agent at the same time
pthread_mutex_t pins_mutex = PTHREAD_MUTEX_INITIALIZER; // protects from modifying same pin at the same time (wiringPi is not thread-safe even when writing different pins at the same time)
pthread_t thread_id;
int current_sensor = -1; // Sensor of the current intersection. 0 = [0][0], 1 = [1][0], 2 = [0][1], 3 = [1][1], 4 = [2][0]

int main()
{

    MYSQL *conn;
    agent agent;
    initialize_pins();
    initialize(&agent);
    conn = initialize_BD();

    if (pthread_create(&thread_id, NULL, refresh_default_sem, (void *)&agent) != 0)
    {
        fprintf(stderr, "ERROR: Cannot creat the thread\n");
        exit(1);
    }

    while (1)
    {
        // Infinite loop until recieve the signal to manage the current node (this is, when the previous agent finishes managing its current node)
        while (agent.start_me == false)
        {
            get_start_me(conn, &agent);
            printf("The vehicle will not pass through any node of this agent yet.\n");
            fflush(stdout);
            usleep(refresh);
        }

        get_data(conn, &agent);
        pthread_mutex_lock(&sensor_mutex);
        current_sensor = agent.nodes[agent.current_coordinates.x][agent.current_coordinates.y].sensor;
        pthread_mutex_unlock(&sensor_mutex);

        pthread_mutex_lock(&sem_mutex);
        agent.nodes[agent.current_coordinates.x][agent.current_coordinates.y].sem_locked = true; // Lock current sem
        pthread_mutex_unlock(&sem_mutex);

        for (int semaphore = 0; semaphore < MAX_SEM; semaphore++)
        { // manage semaphores and state flags for database
            pthread_mutex_lock(&sem_mutex);
            digitalWrite_wrapper(agent.nodes[agent.current_coordinates.x][agent.current_coordinates.y].semaphores[semaphore], agent.sem_status_to_lock[semaphore], &agent.nodes[agent.current_coordinates.x][agent.current_coordinates.y].sem_status[semaphore]);
            pthread_mutex_unlock(&sem_mutex);
        }

        printf("Starting route!!!\n");
        // Reset interruption flag
        pthread_mutex_lock(&sensor_mutex);
        for (int i = 0; i < 5; i++)
        {
            sensor_triggered[i] = 0;
        }
        pthread_mutex_unlock(&sensor_mutex);

        printf("Estado de todos los sensores:\n");
        for (int i = 0; i < 5; i++)
        {
            printf("sensor_triggered[%d] = %d\n", i, sensor_triggered[i]);
        }
        fflush(stdout);

        // Check if the vehicle has arrived to the next node involved in the route
        pthread_mutex_lock(&sensor_mutex);
        while (sensor_triggered[current_sensor] == 0)
        {
            printf("Waiting the activation of sensor %d...\n", current_sensor);
            fflush(stdout);
            pthread_cond_wait(&sensor_cond, &sensor_mutex); // Block until sensor activates the condition. Avoid active waiting
        }
        pthread_mutex_unlock(&sensor_mutex);

        printf("[DEBUG] Vehicle detected at the current intersection of the route.\n");
        fflush(stdout);

        printf("[DEBUG] Locking semaphores at current_coordinates: (%d, %d)\n", agent.current_coordinates.x, agent.current_coordinates.y);
        fflush(stdout);
        pthread_mutex_lock(&sem_mutex);
        agent.nodes[agent.current_coordinates.x][agent.current_coordinates.y].sem_locked = false; // Unlock the semaphores of current node as the vehicle passes through
        pthread_mutex_unlock(&sem_mutex);
        printf("[DEBUG] Finished processing current intersection. Moving to the next one.\n");
        fflush(stdout);
        update_agent_status(conn, &agent);
        agent.start_me = false;

        printf("The emergency vehicle passed through the current node");
        fflush(stdout);
    }
    return 0;
}