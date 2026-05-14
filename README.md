# CloudOps Monitoring Dashboard

A cloud-native infrastructure monitoring platform built using React.js, TypeScript, FastAPI, PostgreSQL, and Docker.

The dashboard visualizes infrastructure telemetry, service health metrics, operational alerts, and infrastructure analytics in real time through interactive charts and monitoring panels.

---

## Features

- Real-time infrastructure telemetry dashboard
- Live CPU, memory, disk, and network monitoring
- Service health tracking
- Operational alerts management
- Interactive monitoring charts
- REST API integration
- PostgreSQL data persistence
- Dockerized infrastructure setup
- Responsive modern UI

---

## Tech Stack

### Frontend
- React.js
- TypeScript
- Axios
- Recharts
- Lucide React

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- REST APIs

### DevOps & Infrastructure
- Docker
- Docker Compose

---

## System Architecture

```text
React Dashboard
       ↓
REST API Calls (Axios)
       ↓
FastAPI Backend Services
       ↓
PostgreSQL Database
