from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    disk_usage = Column(Float)
    network_latency = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)


class ServiceHealth(Base):
    __tablename__ = "service_health"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String)
    status = Column(String)
    response_time = Column(Float)
    last_checked = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String)
    message = Column(String)
    service_name = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)