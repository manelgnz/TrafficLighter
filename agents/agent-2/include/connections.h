#ifndef CONNECTIONS_H
#define CONNECTIONS_H


#include <wiringPi.h>
#include <stdio.h>

// For interruptions and avoinding active waiting
extern volatile int sensor_triggered[5];
extern pthread_mutex_t sensor_mutex;
extern pthread_cond_t sensor_cond;
extern int current_sensor;                 // Sensor of the current intersection



// periphereal_IntersectionPosition | phisical pin | wiringpi notation

// INTERSECTION 00
extern const int LED_00U;  
extern const int LED_00R;  
extern const int LED_00D;  
extern const int LED_00L;  
extern const int SENSOR_00;

// INTERSECTION 01
extern const int LED_01U;  
extern const int LED_01R;  
extern const int LED_01D;  
extern const int LED_01L;  
extern const int SENSOR_01;

// INTERSECTION 10
extern const int LED_10U;  
extern const int LED_10R;  
extern const int LED_10D;  
extern const int LED_10L;  
extern const int SENSOR_10;

// INTERSECTION 11
extern const int LED_11U;  
extern const int LED_11R;  
extern const int LED_11D;  
extern const int LED_11L;  
extern const int SENSOR_11;

// INTERSECTION 21
extern const int LED_21U;  
extern const int LED_21R;  
extern const int LED_21D;  
extern const int LED_21L;  
extern const int SENSOR_21;


void initialize_pins();


#endif //CONNECTIONS_H