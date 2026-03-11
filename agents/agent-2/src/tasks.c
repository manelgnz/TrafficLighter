#include <mariadb/mysql.h>
#include "../include/agent.h"
#include "../include/connections.h"
#include "../include/utils.h"
#include "../include/database.h"

void refresh_default_sem(agent *agent) {
    int sem_refresh_rate = 1000000; // Semaphore refresh interval
    int counter = 0;               // Counter to manage timing
    int refresh_me = 0;            // Current state to alternate directions

    MYSQL *conn =initialize_BD();

    printf("[DEBUG] Semaphore refresh initialized with refresh rate: %d\n", sem_refresh_rate);
    fflush(stdout);

    while (1) { // Infinite loop for thread execution
    pthread_mutex_lock(&sem_mutex);
        for (int node = 0; node < MAX_NODE; node++) {
            int x = agent->node_map[node].x; // Node's x-coordinate
            int y = agent->node_map[node].y; // Node's y-coordinate

            printf("[DEBUG] Processing node %d with coordinates (%d, %d)\n", node, x, y);
            fflush(stdout);

            // Refresh only if the semaphore is not locked
            if (!agent->nodes[x][y].sem_locked) {
                printf("[DEBUG] Semaphore at (%d, %d) is not locked. Refreshing state %d\n", x, y, refresh_me);
                fflush(stdout);

                switch (refresh_me) {
                    case 0: // Direction D-R
                        printf("[DEBUG] Setting direction D-R\n");
                        fflush(stdout);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[2], HIGH, &agent->nodes[x][y].sem_status[2]);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[1], HIGH, &agent->nodes[x][y].sem_status[1]);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[3], LOW, &agent->nodes[x][y].sem_status[3]);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[0], LOW, &agent->nodes[x][y].sem_status[0]);
                        break;
                    case 1: // Direction D-U
                        printf("[DEBUG] Setting direction D-U\n");
                        fflush(stdout);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[0], HIGH, &agent->nodes[x][y].sem_status[0]);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[1], LOW, &agent->nodes[x][y].sem_status[1]);
                        break;
                    case 2: // Direction D-L
                        printf("[DEBUG] Setting direction D-L\n");
                        fflush(stdout);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[3], HIGH, &agent->nodes[x][y].sem_status[3]);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[0], LOW, &agent->nodes[x][y].sem_status[0]);
                        break;
                    case 3: // Direction L-R
                        printf("[DEBUG] Setting direction L-R\n");
                        fflush(stdout);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[1], HIGH, &agent->nodes[x][y].sem_status[1]);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[2], LOW, &agent->nodes[x][y].sem_status[2]);
                        break;
                    case 4: // Direction R-U
                        printf("[DEBUG] Setting direction R-U\n");
                        fflush(stdout);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[0], HIGH, &agent->nodes[x][y].sem_status[0]);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[3], LOW, &agent->nodes[x][y].sem_status[3]);
                        break;
                    case 5: // Direction L-U
                        printf("[DEBUG] Setting direction L-U\n");
                        fflush(stdout);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[3], HIGH, &agent->nodes[x][y].sem_status[3]);
                        digitalWrite_wrapper(agent->nodes[x][y].semaphores[1], LOW, &agent->nodes[x][y].sem_status[1]);
                        break;
                }
            } else {
                printf("[DEBUG] Semaphore at (%d, %d) is locked. Skipping.\n", x, y);
                fflush(stdout);
            }
        }
        pthread_mutex_unlock(&sem_mutex);
        update_all_semaphores(conn, agent);

        // Increment the counter and handle refresh timing
        counter += refresh;
        printf("[DEBUG] Counter incremented to %d\n", counter);
        fflush(stdout);

        if (counter >= sem_refresh_rate) {
            counter = 0; // Reset the counter
            refresh_me = (refresh_me + 1) % 6; // Cycle through states 0 to 5
            printf("[DEBUG] Counter reset. Next refresh state: %d\n", refresh_me);
            fflush(stdout);
        }

        usleep(refresh); // Pause to respect the clock cycle
    }
}



