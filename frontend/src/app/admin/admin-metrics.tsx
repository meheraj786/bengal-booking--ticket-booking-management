"use client";

import { useAdminDashboard } from "@/hooks/use-dashboards";

export default function AdminMetrics() {
  const query = useAdminDashboard();
  const stats = query.data?.stats;
  return (
    <div className="stats-row">
      <div className="stat-box">
        <strong>
          {stats ? `৳ ${(stats.grossRevenue / 100000).toFixed(1)}L` : "—"}
        </strong>
        <span>Total volume</span>
      </div>
      <div className="stat-box">
        <strong>{stats?.bookings?.toLocaleString() ?? "—"}</strong>
        <span>Bookings</span>
      </div>
      <div className="stat-box">
        <strong>{stats?.sellers ?? "—"}</strong>
        <span>Active sellers</span>
      </div>
    </div>
  );
}
