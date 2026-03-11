#ifndef AGENT_H
#define AGENT_H

#include <stdbool.h>

#define MAX_NODE 5
#define MAX_ROUTE MAX_NODE+2
#define MAX_SEM 4
#define WIDTH 3
#define HEIGHT 2


typedef struct {
    int x;
    int y;
} coordinates;


typedef struct{
    int semaphores[MAX_SEM];
    bool sem_status[MAX_SEM];
    int sensor;   // Which position of the interruption array has to read
    bool sem_locked;
}node;

typedef struct {
    node nodes[WIDTH][HEIGHT];
    coordinates current_coordinates;
    coordinates node_map[MAX_NODE];
    int id;
    bool start_me;
    bool sem_status_to_lock[MAX_SEM];
}agent;






#endif //AGENT_H
