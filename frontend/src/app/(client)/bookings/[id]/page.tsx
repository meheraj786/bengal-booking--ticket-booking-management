"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Printer,
  Download,
  ChevronLeft,
  Calendar,
  MapPin,
  Hash,
  Users,
  CheckCircle2,
  CreditCard,
  TicketCheck,
} from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

export default function TicketsPage() {
  const params = useParams();
  const bookingId = params?.id as string;
  const { data: booking, isLoading } = useBooking(bookingId);
  const printRef = useRef<HTMLDivElement>(null);

  const compactBookingId = (id: string) => {
    const hex = id.replace(/-/g, "");
    if (!/^[0-9a-f]{32}$/i.test(hex)) return id.slice(0, 12);
    const bytes = new Uint8Array(
      hex.match(/.{2}/g)!.map((part) => parseInt(part, 16)),
    );
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=900,height=1000");
      if (printWindow) {
        printWindow.document.write(`
          <html>
          <head>
            <title>Bengal Booking Ticket</title>
            <style>
              * { box-sizing: border-box; }
              @page { size: A4 portrait; margin: 0; }
              body {
                margin: 0;
                background: #eef0f5;
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #172033;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .ticket-print {
                width: 210mm;
                min-height: 297mm;
                margin: auto;
                background: #ffffff;
                padding: 0;
                overflow: hidden;
                position: relative;
              }

              /* Header banner */
              .tp-header {
                background: linear-gradient(135deg, #ff6b52 0%, #e6432f 100%);
                color: #fff;
                padding: 16mm 14mm 10mm 14mm;
                position: relative;
              }
              .tp-brand {
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 3px;
                text-transform: uppercase;
                opacity: 0.9;
              }
              .tp-title {
                font-size: 26px;
                font-weight: 800;
                margin: 8px 0 6px 0;
                line-height: 1.2;
              }
              .tp-desc {
                font-size: 11.5px;
                opacity: 0.92;
                max-width: 480px;
                line-height: 1.5;
                margin: 0;
              }
              .tp-meta-row {
                display: flex;
                gap: 28px;
                margin-top: 14px;
                flex-wrap: wrap;
              }
              .tp-meta-item {
                font-size: 11.5px;
              }
              .tp-meta-label {
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
                opacity: 0.8;
                margin-bottom: 3px;
              }
              .tp-meta-value {
                font-weight: 700;
              }
              .tp-status-chip {
                position: absolute;
                top: 16mm;
                right: 14mm;
                background: rgba(255,255,255,0.18);
                border: 1px solid rgba(255,255,255,0.5);
                border-radius: 999px;
                padding: 5px 14px;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.5px;
              }

              /* Perforation */
              .tp-perforation {
                position: relative;
                height: 0;
                border-top: 2px dashed #d8dde5;
                margin: 0 14mm;
              }
              .tp-perforation::before,
              .tp-perforation::after {
                content: "";
                position: absolute;
                top: -10px;
                width: 20px;
                height: 20px;
                background: #eef0f5;
                border-radius: 50%;
              }
              .tp-perforation::before { left: -24px; }
              .tp-perforation::after { right: -24px; }

              .tp-body { padding: 10mm 14mm 6mm 14mm; }

              /* Organizer */
              .tp-organizer {
                display: flex;
                align-items: center;
                gap: 12px;
                background: #f2edff;
                border-radius: 14px;
                padding: 10px 14px;
                margin-bottom: 14px;
              }
              .tp-organizer-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #7c6bea;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 15px;
                flex-shrink: 0;
                overflow: hidden;
              }
              .tp-organizer-avatar img { width: 100%; height: 100%; object-fit: cover; }
              .tp-organizer-label {
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #6b7280;
              }
              .tp-organizer-name { font-weight: 700; font-size: 13px; }

              /* Stats grid */
              .tp-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                background: #f8f9fb;
                border-radius: 14px;
                padding: 14px;
                margin-bottom: 16px;
              }
              .tp-stat { text-align: center; border-right: 1px solid #e5e7eb; }
              .tp-stat:last-child { border-right: none; }
              .tp-stat-label {
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: #6b7280;
                margin-bottom: 4px;
              }
              .tp-stat-value { font-size: 14px; font-weight: 800; }
              .tp-stat-value.green { color: #15803d; }

              /* Section title */
              .tp-section-title {
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 6px 0 10px 0;
              }
              .tp-section-bar {
                width: 4px;
                height: 16px;
                background: #ff6b52;
                border-radius: 2px;
              }
              .tp-section-title h2 {
                font-size: 14px;
                font-weight: 800;
                margin: 0;
              }

              /* Table */
              table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
              .tp-table-wrap {
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                overflow: hidden;
              }
              table th {
                background: #172033;
                color: #fff;
                text-align: left;
                font-size: 9.5px;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                padding: 10px 12px;
              }
              table td {
                border-bottom: 1px solid #eef0f3;
                padding: 10px 12px;
                font-size: 11px;
                vertical-align: middle;
              }
              table tr:last-child td { border-bottom: none; }
              table tr:nth-child(even) td { background: #fdf8f5; }
              .status {
                display: inline-block;
                border-radius: 999px;
                padding: 3px 10px;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.4px;
              }
              .status.sold { background: #dbeafe; color: #1e40af; }
              .status.available { background: #dcfce7; color: #166534; }

              /* Summary grid */
              .tp-summary-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 14px;
                margin-bottom: 16px;
              }
              .summary-box {
                border-radius: 14px;
                background: #f2edff;
                padding: 14px 16px;
              }
              .summary-box.alt { background: #fff4ef; }
              .summary-box h3 {
                font-size: 11px;
                font-weight: 800;
                margin: 0 0 8px 0;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                color: #6b46c1;
              }
              .summary-box.alt h3 { color: #c2410c; }
              .summary-box p { margin: 3px 0; font-size: 11.5px; line-height: 1.5; }
              .summary-box .label { color: #6b7280; font-size: 10px; }
              .summary-box .amount {
                font-size: 16px;
                font-weight: 800;
                margin-top: 8px;
              }

              /* Barcode footer */
              .tp-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-top: 1px dashed #d8dde5;
                padding-top: 14px;
                margin-top: 6px;
              }
              .tp-barcode {
                height: 34px;
                width: 200px;
                background: repeating-linear-gradient(
                  90deg,
                  #172033 0px,
                  #172033 2px,
                  transparent 2px,
                  transparent 4px,
                  #172033 4px,
                  #172033 5px,
                  transparent 5px,
                  transparent 8px
                );
              }
              .tp-footer-id {
                font-family: 'Courier New', monospace;
                font-size: 10px;
                color: #6b7280;
                margin-top: 4px;
              }
              .tp-footer-note {
                text-align: right;
                font-size: 9px;
                color: #9ca3af;
                max-width: 240px;
                line-height: 1.5;
              }

              @media print {
                body { background: #fff; }
                .ticket-print { box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="ticket-print">${printRef.current.innerHTML}</div>
          </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
      }
    }
  };

  const handleDownload = () => {
    const element = printRef.current;
    if (!element) return;

    const html2canvas = require("html2canvas");
    const jsPDF = require("jspdf");

    html2canvas(element, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 277);
      pdf.save(`${booking?.event?.title}-tickets.pdf`);
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto w-[min(1180px,calc(100%-48px))] py-10 max-md:w-[calc(100%-32px)]">
          <Skeleton className="mb-6 h-9 w-40 rounded-full" />
          <Skeleton className="mx-auto h-[1100px] max-w-[794px] rounded-3xl" />
        </div>
      </main>
    );
  }

  if (!booking || booking.status !== "CONFIRMED" || !booking.tickets) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto w-[min(1180px,calc(100%-48px))] py-10 max-md:w-[calc(100%-32px)]">
          <Button asChild variant="ghost" className="mb-4 gap-1.5">
            <Link href="/bookings">
              <ChevronLeft className="h-4 w-4" />
              Back to bookings
            </Link>
          </Button>
          <Card className="rounded-3xl border-dashed shadow-none">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <TicketCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-slate-700">
                No tickets found for this booking.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto w-[min(1180px,calc(100%-48px))] pt-8 max-md:w-[calc(100%-32px)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" className="gap-1.5 -ml-2">
            <Link href="/bookings">
              <ChevronLeft className="h-4 w-4" />
              Back to bookings
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="gap-2 rounded-full"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleDownload} className="gap-2 rounded-full">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* On-screen ticket / also captured for PDF & print */}
        <div
          ref={printRef}
          className="ticket-print mx-auto max-w-[794px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5"
        >
          {/* Header banner */}
          <div className="tp-header relative bg-gradient-to-br from-[#ff6b52] to-[#e6432f] px-8 py-8 text-white sm:px-10 sm:py-9">
            <Badge className="tp-status-chip absolute right-8 top-8 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[10px] font-bold tracking-wide text-white hover:bg-white/15 sm:right-10 sm:top-9">
              CONFIRMED
            </Badge>
            <p className="tp-brand text-[11px] font-extrabold uppercase tracking-[3px] opacity-90">
              Bengal Booking
            </p>
            <h1 className="tp-title mt-2 max-w-md text-2xl font-extrabold leading-tight sm:text-3xl">
              {booking.event?.title}
            </h1>
            {booking.event?.description && (
              <p className="tp-desc mt-2 max-w-md text-[12px] leading-relaxed opacity-90">
                {booking.event.description}
              </p>
            )}
            <div className="tp-meta-row mt-5 flex flex-wrap gap-6 sm:gap-8">
              <div className="tp-meta-item flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-90" />
                <div>
                  <p className="tp-meta-label text-[9px] uppercase tracking-wider opacity-80">
                    Date
                  </p>
                  <p className="tp-meta-value text-sm font-bold">
                    {new Date(booking.event?.startAt || "").toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="tp-meta-item flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-90" />
                <div>
                  <p className="tp-meta-label text-[9px] uppercase tracking-wider opacity-80">
                    Venue
                  </p>
                  <p className="tp-meta-value text-sm font-bold">
                    {booking.event?.venueName}, {booking.event?.venueAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Perforation cut line */}
          <div className="tp-perforation relative mx-8 border-t-2 border-dashed border-slate-200 sm:mx-10" />

          <div className="tp-body px-8 py-6 sm:px-10">
            {/* Organizer */}
            {booking.event?.seller && (
              <div className="tp-organizer mb-5 flex items-center gap-3 rounded-2xl bg-[var(--lavender)] p-3.5">
                <div className="tp-organizer-avatar relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-[#7c6bea]">
                  {booking.event.seller.image ? (
                    <Image
                      src={booking.event.seller.image}
                      alt={booking.event.seller.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-lg font-bold text-white">
                      {booking.event.seller.name?.charAt(0).toUpperCase() ??
                        "O"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="tp-organizer-label text-[9px] uppercase tracking-wider text-slate-500">
                    Organizer
                  </p>
                  <p className="tp-organizer-name font-bold text-slate-900">
                    {booking.event.seller.name ?? "Event organizer"}
                  </p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="tp-stats mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-4">
              <div className="tp-stat border-slate-200 text-center sm:border-r">
                <p className="tp-stat-label mb-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                  <Hash className="h-3 w-3" /> Booking ID
                </p>
                <p className="tp-stat-value font-mono text-sm font-extrabold">
                  {compactBookingId(booking.id)}
                </p>
              </div>
              <div className="tp-stat border-slate-200 text-center sm:border-r">
                <p className="tp-stat-label mb-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                  <Users className="h-3 w-3" /> Total Tickets
                </p>
                <p className="tp-stat-value text-lg font-extrabold">
                  {booking.tickets.length}
                </p>
              </div>
              <div className="tp-stat border-slate-200 text-center sm:border-r">
                <p className="tp-stat-label mb-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                  <CheckCircle2 className="h-3 w-3" /> Status
                </p>
                <p className="tp-stat-value green font-extrabold text-green-700">
                  {booking.status}
                </p>
              </div>
              <div className="tp-stat text-center">
                <p className="tp-stat-label mb-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                  <CreditCard className="h-3 w-3" /> Payment
                </p>
                <p className="tp-stat-value font-extrabold">
                  {booking.payment?.status ?? "SUCCESS"}
                </p>
              </div>
            </div>

            {/* Tickets table */}
            <div className="mb-6">
              <div className="tp-section-title mb-3 flex items-center gap-2">
                <span className="tp-section-bar h-4 w-1 rounded-full bg-[#ff6b52]" />
                <h2 className="text-sm font-extrabold">Admission details</h2>
              </div>
              <div className="tp-table-wrap overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-slate-900 text-[10px] uppercase tracking-wider text-white">
                    <tr>
                      <th className="px-3 py-2.5">Ticket</th>
                      <th className="px-3 py-2.5">Description</th>
                      <th className="px-3 py-2.5">Ticket ID</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.tickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b last:border-b-0 even:bg-[#fdf8f5]"
                      >
                        <td className="px-3 py-2.5 font-bold">{ticket.name}</td>
                        <td className="max-w-[180px] px-3 py-2.5 text-xs text-slate-600">
                          {ticket.description || "—"}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs">
                          {compactBookingId(ticket.id)}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`status inline-block rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${
                              ticket.status === "SOLD"
                                ? "sold bg-blue-100 text-blue-800"
                                : "available bg-green-100 text-green-800"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold">
                          ৳{Number(ticket.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="tp-summary-grid mb-6 grid gap-4 sm:grid-cols-2">
              <div className="summary-box rounded-2xl bg-[var(--lavender)] p-4">
                <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-violet-700">
                  Booking information
                </h3>
                <p className="text-[13px]">
                  <span className="label text-slate-500">Name: </span>
                  {booking.buyerName}
                </p>
                <p className="text-[13px]">
                  <span className="label text-slate-500">Phone: </span>
                  {booking.buyerPhone}
                </p>
                <p className="text-[13px]">
                  <span className="label text-slate-500">Address: </span>
                  {booking.buyerAddress}
                </p>
              </div>
              <div className="summary-box alt rounded-2xl bg-orange-50 p-4 sm:text-right">
                <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-orange-700">
                  Order summary
                </h3>
                <p className="text-[13px]">
                  <span className="label text-slate-500">Booking Date: </span>
                  {new Date(booking.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="amount mt-2 text-base font-extrabold">
                  Amount paid: ৳ {Number(booking.totalAmount).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Barcode footer */}
            <div className="tp-footer flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-slate-200 pt-5">
              <div>
                <div
                  className="tp-barcode h-8 w-48"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg,#172033 0px,#172033 2px,transparent 2px,transparent 4px,#172033 4px,#172033 5px,transparent 5px,transparent 8px)",
                  }}
                />
                <p className="tp-footer-id mt-1 font-mono text-[10px] text-slate-500">
                  {compactBookingId(booking.id)}
                </p>
              </div>
              <p className="tp-footer-note max-w-[240px] text-right text-[9px] leading-relaxed text-slate-400">
                This ticket is valid for single entry only. Please carry a valid
                ID for verification at the venue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
