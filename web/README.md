# 🚦 Traffic Lighter | IoT Emergency Priority System

[![Hardware](https://img.shields.io/badge/Hardware-Raspberry%20Pi%204-brightgreen.svg)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20MariaDB-blue.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-Angular%2017-red.svg)](#)

Distributed IoT system designed to manage urban traffic lights dynamically, prioritizing emergency vehicles (ambulances) using a multi-agent architecture.

## 🌟 Project Overview
Emergency vehicles often lose critical seconds at red lights or in traffic jams. **Traffic Lighter** uses ubiquitous computing to detect emergency vehicles and clear their path by synchronizing traffic signals in real-time.

### Key Features
* **Smart Priority:** Real-time traffic light preemption for emergency vehicles.
* **$A^*$ Pathfinding:** Backend calculation of optimal routes using Manhattan distance heuristics.
* **Multi-Agent System:** Each Raspberry Pi acts as an independent agent managing its own intersection.
* **Real-Time Dashboard:** Interactive map built with Angular to monitor vehicle positions and traffic light statuses.

---

## 🏗️ System Architecture
The system is divided into four main layers:
1. **Agents (C / Raspberry Pi):** Hardware control using `WiringPi`. Detects vehicles via magnetic sensors (Reed switches).
2. **Server (Node.js):** REST API that orchestrates route calculations and state logic.
3. **Database (MariaDB):** Centralized state management for real-time synchronization.
4. **Web Client (Angular):** User interface for emergency dispatchers to set routes and view live traffic.

---

## 🕹️ How it Works
1. **Request:** An ambulance requests a route through the Angular dashboard.
2. **Calculation:** The server computes the path using the **A* algorithm**.
3. **Activation:** As the vehicle approaches an intersection (detected by sensors), the local **C Agent** switches the traffic light to green and blocks conflicting flows.
4. **Security:** All database interactions use **parameterized queries** to prevent SQL injection.

---

## 📂 Repository Structure
* `/agents`: Source code for Raspberry Pi nodes (C).
* `/server-API`: Node.js Express server and route logic.
* `/web`: Angular frontend application.
* `database_creation_Definitive.sql`: Database schema for MariaDB.

---

## 👨‍💻 Authors
**Manel González Mestre** & **Diego Arcos Sapena**

*Project developed for the Ubiquitous Computing course at URV (Universitat Rovira i Virgili).*
