from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import random

from database import Base, engine, SessionLocal
from models import Metric, ServiceHealth, Alert

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CloudOps Monitoring Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "CloudOps Monitoring API is running"}


@app.post("/api/seed")
def seed_data(db: Session = Depends(get_db)):
    metric = Metric(
        cpu_usage=random.randint(20, 95),
        memory_usage=random.randint(30, 90),
        disk_usage=random.randint(40, 90),
        network_latency=random.randint(20, 300),
    )

    db.add(metric)

    services = [
        "Authentication Service",
        "Payment API",
        "PostgreSQL Database",
        "Notification Worker",
    ]

    for service in services:
        db.add(
            ServiceHealth(
                service_name=service,
                status=random.choice(["Healthy", "Warning", "Down"]),
                response_time=random.randint(40, 500),
            )
        )

    alerts = [
        ("Critical", "CPU usage crossed 90%", "Compute Node"),
        ("Warning", "Database response time is high", "PostgreSQL Database"),
        ("Info", "Nightly backup completed", "Storage Service"),
    ]

    for severity, message, service_name in alerts:
        db.add(
            Alert(
                severity=severity,
                message=message,
                service_name=service_name,
            )
        )

    db.commit()

    return {"message": "Sample monitoring data inserted successfully"}


@app.get("/api/metrics/latest")
def get_latest_metrics(db: Session = Depends(get_db)):
    return db.query(Metric).order_by(Metric.id.desc()).first()


@app.get("/api/metrics/history")
def get_metrics_history(db: Session = Depends(get_db)):
    return db.query(Metric).order_by(Metric.id.desc()).limit(10).all()


@app.get("/api/services")
def get_services(db: Session = Depends(get_db)):
    return db.query(ServiceHealth).order_by(ServiceHealth.id.desc()).limit(4).all()


@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.id.desc()).limit(5).all()