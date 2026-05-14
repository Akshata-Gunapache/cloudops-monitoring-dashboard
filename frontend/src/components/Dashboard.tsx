import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  RefreshCw,
  Server,
  Wifi,
} from "lucide-react";
import {
  getAlerts,
  getLatestMetrics,
  getMetricsHistory,
  getServices,
  seedData,
} from "../api/api";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Metric = {
  id: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_latency: number;
  timestamp: string;
};

type Service = {
  id: number;
  service_name: string;
  status: string;
  response_time: number;
  last_checked: string;
};

type Alert = {
  id: number;
  severity: string;
  message: string;
  service_name: string;
  timestamp: string;
};

function Dashboard() {
  const [latestMetric, setLatestMetric] = useState<Metric | null>(null);
  const [history, setHistory] = useState<Metric[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [latestRes, historyRes, servicesRes, alertsRes] =
        await Promise.all([
          getLatestMetrics(),
          getMetricsHistory(),
          getServices(),
          getAlerts(),
        ]);

      setLatestMetric(latestRes.data);
      setHistory(historyRes.data.reverse());
      setServices(servicesRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateData = async () => {
    await seedData();
    await loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const healthyServices = services.filter(
    (service) => service.status === "Healthy"
  ).length;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">CloudOps Monitoring</p>
          <h1>Infrastructure Health Dashboard</h1>
          <p className="subtitle">
            Real-time visibility into infrastructure telemetry, service health,
            logs, and operational alerts.
          </p>
        </div>

        <button className="primary-btn" onClick={handleGenerateData}>
          <RefreshCw size={18} />
          Generate Live Data
        </button>
      </header>

      <section className="status-grid">
        <div className="status-card">
          <div className="card-icon cpu">
            <Cpu size={22} />
          </div>
          <div>
            <p>CPU Usage</p>
            <h2>{latestMetric?.cpu_usage ?? 0}%</h2>
          </div>
        </div>

        <div className="status-card">
          <div className="card-icon memory">
            <MemoryStick size={22} />
          </div>
          <div>
            <p>Memory Usage</p>
            <h2>{latestMetric?.memory_usage ?? 0}%</h2>
          </div>
        </div>

        <div className="status-card">
          <div className="card-icon disk">
            <HardDrive size={22} />
          </div>
          <div>
            <p>Disk Usage</p>
            <h2>{latestMetric?.disk_usage ?? 0}%</h2>
          </div>
        </div>

        <div className="status-card">
          <div className="card-icon network">
            <Wifi size={22} />
          </div>
          <div>
            <p>Latency</p>
            <h2>{latestMetric?.network_latency ?? 0}ms</h2>
          </div>
        </div>
      </section>

      <main className="dashboard-layout">
        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Telemetry Trends</h3>
              <p>CPU, memory, and disk usage across recent samples.</p>
            </div>
            <span className={loading ? "sync active" : "sync"}>
              <Activity size={15} />
              Auto-refresh
            </span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="memory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu_usage"
                  stroke="#6366f1"
                  fill="url(#cpu)"
                  strokeWidth={3}
                  name="CPU"
                />
                <Area
                  type="monotone"
                  dataKey="memory_usage"
                  stroke="#22c55e"
                  fill="url(#memory)"
                  strokeWidth={3}
                  name="Memory"
                />
                <Area
                  type="monotone"
                  dataKey="disk_usage"
                  stroke="#f97316"
                  fillOpacity={0}
                  strokeWidth={3}
                  name="Disk"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel summary-panel">
          <h3>Operational Summary</h3>

          <div className="summary-item">
            <Server size={19} />
            <div>
              <p>Total Services</p>
              <strong>{services.length}</strong>
            </div>
          </div>

          <div className="summary-item">
            <Database size={19} />
            <div>
              <p>Healthy Services</p>
              <strong>{healthyServices}</strong>
            </div>
          </div>

          <div className="summary-item">
            <AlertTriangle size={19} />
            <div>
              <p>Active Alerts</p>
              <strong>{alerts.length}</strong>
            </div>
          </div>
        </section>
      </main>

      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Service Health</h3>
              <p>Current status of core platform services.</p>
            </div>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <div className="service-row" key={service.id}>
                <div>
                  <strong>{service.service_name}</strong>
                  <p>{service.response_time}ms response time</p>
                </div>
                <span className={`badge ${service.status.toLowerCase()}`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>System Alerts</h3>
              <p>Latest infrastructure alerts and warnings.</p>
            </div>
          </div>

          <div className="alert-list">
            {alerts.map((alert) => (
              <div className="alert-row" key={alert.id}>
                <span className={`alert-dot ${alert.severity.toLowerCase()}`} />
                <div>
                  <strong>{alert.message}</strong>
                  <p>
                    {alert.severity} · {alert.service_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;