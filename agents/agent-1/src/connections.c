#include <wiringPi.h>
#include <stdio.h>
#include <pthread.h>

#include "../include/connections.h"


// periphereal_IntersectionPosition 

// INTERSECTION 00

const int LED_00L = 3;   
const int LED_00U = 12;   
const int LED_00R = 13;   
const int LED_00D = 14;   
const int SENSOR_00 = 21; 



// INTERSECTION 01
const int LED_01U = 22;   
const int LED_01R = 23;   
const int LED_01D = 24;   
const int LED_01L = 25;   
const int SENSOR_01 = 1;  

// INTERSECTION 10
const int LED_10D = 8;   
const int LED_10L = 9;    
const int LED_10U = 7;    
const int LED_10R = 0;    
const int SENSOR_10 = 2; 


// INTERSECTION 11
const int LED_11L = 10;    
const int LED_11U = 4;    
const int LED_11R = 5;    
const int LED_11D = 6;    
const int SENSOR_11 = 11; 

// INTERSECTION 20
const int LED_20U = 31;   
const int LED_20R = 26;   
const int LED_20D = 27;   
const int LED_20L = 28;   
const int SENSOR_20 = 29; 


volatile int sensor_triggered[5] = {0};
pthread_mutex_t sensor_mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t sensor_cond = PTHREAD_COND_INITIALIZER;


// Interrupt functions for each sensor
void sensor_00_handler() {
    pthread_mutex_lock(&sensor_mutex);
    if (current_sensor == 0) { // Only if it's the correct sensor
        sensor_triggered[0] = 1; 
        pthread_cond_signal(&sensor_cond); 
    }
    pthread_mutex_unlock(&sensor_mutex);
}

void sensor_10_handler() {
    pthread_mutex_lock(&sensor_mutex); 
    if (current_sensor == 1) { // Only if it's the correct sensor
        sensor_triggered[1] = 1;
        pthread_cond_signal(&sensor_cond); 
    }
    pthread_mutex_unlock(&sensor_mutex);
}

void sensor_01_handler() {
    pthread_mutex_lock(&sensor_mutex);
    if (current_sensor == 2) { // Only if it's the correct sensor
        sensor_triggered[2] = 1; 
        pthread_cond_signal(&sensor_cond); 
    }
    pthread_mutex_unlock(&sensor_mutex);
}

void sensor_11_handler() {
    pthread_mutex_lock(&sensor_mutex);
    if (current_sensor == 3) { // Only if it's the correct sensor
        sensor_triggered[3] = 1; 
        pthread_cond_signal(&sensor_cond); 
    }
    pthread_mutex_unlock(&sensor_mutex);
}

void sensor_20_handler() {
    pthread_mutex_lock(&sensor_mutex);
    if (current_sensor == 4) { // Only if it's the correct sensor
        sensor_triggered[4] = 1; 
        pthread_cond_signal(&sensor_cond); 
    }
    pthread_mutex_unlock(&sensor_mutex);
}



void initialize_pins(){
    if (wiringPiSetup() == -1)
    {
        printf("Error al inicializar WiringPi\n");
        return 1;
    }
    // Configure all pines as an OUTPUT and set them to 0

    pinMode(LED_00U, OUTPUT);
    digitalWrite(LED_00U, LOW);
    pinMode(LED_00R, OUTPUT);
    digitalWrite(LED_00R, LOW);
    pinMode(LED_00D, OUTPUT);
    digitalWrite(LED_00D, LOW);
    pinMode(LED_00L, OUTPUT);
    digitalWrite(LED_00L, LOW);
    pinMode(SENSOR_00, INPUT);
    pullUpDnControl(SENSOR_00, PUD_UP); // Only works with PUP_UP, so digitalRead() has to be negated
    wiringPiISR(SENSOR_00, INT_EDGE_RISING, &sensor_00_handler);  // Set interruption

    pinMode(LED_01U, OUTPUT);
    digitalWrite(LED_01U, LOW);
    pinMode(LED_01R, OUTPUT);
    digitalWrite(LED_01R, LOW);
    pinMode(LED_01D, OUTPUT);
    digitalWrite(LED_01D, LOW);
    pinMode(LED_01L, OUTPUT);
    digitalWrite(LED_01L, LOW);
    pinMode(SENSOR_01, INPUT);
    pullUpDnControl(SENSOR_01, PUD_UP);  
    wiringPiISR(SENSOR_01, INT_EDGE_RISING, &sensor_01_handler);  // Set interruption


    pinMode(LED_10U, OUTPUT);
    digitalWrite(LED_10U, LOW);
    pinMode(LED_10R, OUTPUT);
    digitalWrite(LED_10R, LOW);
    pinMode(LED_10D, OUTPUT);
    digitalWrite(LED_10D, LOW);
    pinMode(LED_10L, OUTPUT);
    digitalWrite(LED_10L, LOW);
    pinMode(SENSOR_10, INPUT);
    pullUpDnControl(SENSOR_10, PUD_UP);
    wiringPiISR(SENSOR_10, INT_EDGE_RISING, &sensor_10_handler);  // Set interruption


    pinMode(LED_11U, OUTPUT);
    digitalWrite(LED_11U, LOW);
    pinMode(LED_11R, OUTPUT);
    digitalWrite(LED_11R, LOW);
    pinMode(LED_11D, OUTPUT);
    digitalWrite(LED_11D, LOW);
    pinMode(LED_11L, OUTPUT);
    digitalWrite(LED_11L, LOW);
    pinMode(SENSOR_11, INPUT);
    pullUpDnControl(SENSOR_11, PUD_UP);
    wiringPiISR(SENSOR_11, INT_EDGE_RISING, &sensor_11_handler);  // Set interruption



    pinMode(LED_20U, OUTPUT);
    digitalWrite(LED_20U, LOW);
    pinMode(LED_20R, OUTPUT);
    digitalWrite(LED_20R, LOW);
    pinMode(LED_20D, OUTPUT);
    digitalWrite(LED_20D, LOW);
    pinMode(LED_20L, OUTPUT);
    digitalWrite(LED_20L, LOW);
    pinMode(SENSOR_20, INPUT);
    pullUpDnControl(SENSOR_20, PUD_UP);
    wiringPiISR(SENSOR_20, INT_EDGE_RISING, &sensor_20_handler);  // Set interruption


}