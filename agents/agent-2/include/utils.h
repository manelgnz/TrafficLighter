#ifndef UTILS_H
#define UTILS_H

#include <stdio.h>
#include <pthread.h>
#include <wiringPi.h>
#include "../include/agent.h"

void initialize(agent *agent);
void digitalWrite_wrapper(int pin, int value, bool *target);

extern int refresh;
extern pthread_mutex_t sem_mutex;
extern pthread_mutex_t pins_mutex;

#endif //UTILS_H
