"use client";

import { useSellerDashboard } from "@/hooks/use-dashboards";

export default function SellerMetrics() {
  const query = useSellerDashboard();
  const stats = query.data?.stats;
  return (
    <div className="stats-row">
      <div className="stat-box">
        <strong>{stats?.publishedEvents ?? "—"}</strong>
        <span>Published events</span>
      </div>
      <div className="stat-box">
        <strong>{stats?.ticketsSold?.toLocaleString() ?? "—"}</strong>
        <span>Tickets sold</span>
      </div>
      <div className="stat-box">
        <strong>
          {stats ? `৳ ${(stats.grossRevenue / 100000).toFixed(1)}L` : "—"}
        </strong>
        <span>Gross revenue</span>
      </div>
    </div>
  );
}
