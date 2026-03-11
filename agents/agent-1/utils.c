/*Hab�a un led y un reed switch conectado. Si detectaba un iman, se encend�a el led:

#define REED_SWITCH 8 // Pin GPIO 0
#define LED_PIN 5
int main(void)
{
    // Inicializa WiringPi
    if (wiringPiSetup() == -1)
    {
        printf("Error al inicializar WiringPi\n");
        return 1;
    }

    // Configura el pin como salida
    pinMode(LED_PIN, OUTPUT);
    pinMode(REED_SWITCH, INPUT);

    while (1)
    {
        (digitalRead(REED_SWITCH)) ? digitalWrite(LED_PIN, LOW) : digitalWrite(LED_PIN, HIGH);
        delay(1000);
    }

    return 0;
}

-----------------------------------------------------------------------------------------------------------

Aqu� est�n todos los pines que vamos a utilizar (25)

#include <wiringPi.h>
#include <stdio.h>

#define PIN_3 8
#define PIN_5 9
#define PIN_7 7
#define PIN_11 0
#define PIN_13 2
#define PIN_15 3
#define PIN_19 12
#define PIN_21 13
#define PIN_23 14
#define PIN_29 21
#define PIN_31 22
#define PIN_33 23
#define PIN_35 24
#define PIN_37 25
#define PIN_10 16
#define PIN_12 1
#define PIN_16 4
#define PIN_18 5
#define PIN_22 6
#define PIN_24 10
#define PIN_26 11
#define PIN_32 26
#define PIN_36 27
#define PIN_38 28
#define PIN_40 29


int main()
{
    if (wiringPiSetup() == -1)
    {
        printf("Error al inicializar WiringPi\n");
        return 1;
    }
    // Configura todos los pines como salida
    pinMode(PIN_3, OUTPUT);
    digitalWrite(PIN_3, HIGH);
    pinMode(PIN_5, OUTPUT);
    digitalWrite(PIN_5, HIGH);
    pinMode(PIN_7, OUTPUT);
    digitalWrite(PIN_7, HIGH);
    pinMode(PIN_11, OUTPUT);
    digitalWrite(PIN_11, HIGH);
    pinMode(PIN_13, OUTPUT);
    digitalWrite(PIN_13, HIGH);
    pinMode(PIN_15, OUTPUT);
    digitalWrite(PIN_15, HIGH);
    pinMode(PIN_19, OUTPUT);
    digitalWrite(PIN_19, HIGH);
    pinMode(PIN_21, OUTPUT);
    digitalWrite(PIN_21, HIGH);
    pinMode(PIN_23, OUTPUT);
    digitalWrite(PIN_23, HIGH);
    pinMode(PIN_29, OUTPUT);
    digitalWrite(PIN_29, HIGH);
    pinMode(PIN_31, OUTPUT);
    digitalWrite(PIN_31, HIGH);
    pinMode(PIN_33, OUTPUT);
    digitalWrite(PIN_33, HIGH);
    pinMode(PIN_35, OUTPUT);
    digitalWrite(PIN_35, HIGH);
    pinMode(PIN_37, OUTPUT);
    digitalWrite(PIN_37, HIGH);
    pinMode(PIN_10, OUTPUT);
    digitalWrite(PIN_10, HIGH);
    pinMode(PIN_12, OUTPUT);
    digitalWrite(PIN_12, HIGH);
    pinMode(PIN_16, OUTPUT);
    digitalWrite(PIN_16, HIGH);
    pinMode(PIN_18, OUTPUT);
    digitalWrite(PIN_18, HIGH);
    pinMode(PIN_22, OUTPUT);
    digitalWrite(PIN_22, HIGH);
    pinMode(PIN_24, OUTPUT);
    digitalWrite(PIN_24, HIGH);
    pinMode(PIN_26, OUTPUT);
    digitalWrite(PIN_26, HIGH);
    pinMode(PIN_32, OUTPUT);
    digitalWrite(PIN_32, HIGH);
    pinMode(PIN_36, OUTPUT);
    digitalWrite(PIN_36, HIGH);
    pinMode(PIN_38, OUTPUT);
    digitalWrite(PIN_38, HIGH);
    pinMode(PIN_40, OUTPUT);
    digitalWrite(PIN_40, HIGH);
    while (1)
    {
        delay(100);
    }
}
*/


/*void blink_led(int led_pin) {
    digitalWrite(led_pin, HIGH);  // Enciende el LED
    delay(300);                   // Espera 500 milisegundos (medio segundo)
    digitalWrite(led_pin, LOW);   // Apaga el LED
}

// Funci�n principal
int main() {
    // Inicializar pines
    initialize_pins();

    // Secuencia para encender y apagar los LEDs
    while (1) {
        blink_led(LED_01U);  // Cambi� LED_AU por LED_01U
        blink_led(LED_01R);  // Cambi� LED_AR por LED_01R
        blink_led(LED_01D);  // Cambi� LED_AD por LED_01D
        blink_led(LED_01L);  // Cambi� LED_AL por LED_01L
        
        blink_led(LED_11U);  // Cambi� LED_BU por LED_11U
        blink_led(LED_11R);  // Cambi� LED_BR por LED_11R
        blink_led(LED_11D);  // Cambi� LED_BD por LED_11D
        blink_led(LED_11L);  // Cambi� LED_BL por LED_11L
        
        blink_led(LED_10U);  // Cambi� LED_CU por LED_10U
        blink_led(LED_10R);  // Cambi� LED_CR por LED_10R
        blink_led(LED_10D);  // Cambi� LED_CD por LED_10D
        blink_led(LED_10L);  // Cambi� LED_CL por LED_10L
        
        blink_led(LED_00U);  // Cambi� LED_DU por LED_00U
        blink_led(LED_00R);  // Cambi� LED_DR por LED_00R
        blink_led(LED_00D);  // Cambi� LED_DD por LED_00D
        blink_led(LED_00L);  // Cambi� LED_DL por LED_00L

        blink_led(LED_20U);  // Cambi� LED_DU por LED_00U
        blink_led(LED_20R);  // Cambi� LED_DR por LED_00R
        blink_led(LED_20D);  // Cambi� LED_DD por LED_00D
        blink_led(LED_20L);  // Cambi� LED_DL por LED_00L

        // Pausa para repetir la secuencia
        delay(1000);  // Espera 1 segundo antes de reiniciar la secuencia (si lo deseas)
    }

    return 0;
}
}*/

/*

int main()
{
    agent agent;
initialize_pins();
 initialize(&agent);

while (1)
    {
        for (int node = 0; node < MAX_NODE; node++)
        {
            int x = agent.node_map[node].x; // In order to access only existing positions
            int y = agent.node_map[node].y;
            if (!digitalRead(agent.nodes[x][y].sensor) == 1)
            {
                digitalWrite(agent.nodes[x][y].semaphores[0], HIGH);
                digitalWrite(agent.nodes[x][y].semaphores[1], HIGH);
                digitalWrite(agent.nodes[x][y].semaphores[2], HIGH);
                digitalWrite(agent.nodes[x][y].semaphores[3], HIGH);
            }
            else
            {
                digitalWrite(agent.nodes[x][y].semaphores[0], LOW);
                digitalWrite(agent.nodes[x][y].semaphores[1], LOW);
                digitalWrite(agent.nodes[x][y].semaphores[2], LOW);
                digitalWrite(agent.nodes[x][y].semaphores[3], LOW);
            }
        }
    }
}
*/

