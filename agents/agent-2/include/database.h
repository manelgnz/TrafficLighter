#ifndef DATABASE_H
#define DATABASE_H
#include <mariadb/mysql.h>


MYSQL *initialize_BD();
bool get_agent_route(MYSQL *conn, agent *agent);
void get_start_me(MYSQL *conn, agent *agent);
bool get_data(MYSQL *conn, agent *agent);
void update_all_semaphores(MYSQL *conn, agent *agent);
void update_agent_status(MYSQL *conn, agent *agent);


#endif //DATABASE_H
