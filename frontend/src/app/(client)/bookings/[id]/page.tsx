"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, ChevronLeft } from "lucide-react";
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
    const bytes = new Uint8Array(hex.match(/.{2}/g)!.map((part) => parseInt(part, 16)));
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html><head><title>Bengal Booking Ticket</title>
          <style>
            @page{size:A4 portrait;margin:0}
            body{margin:0;background:#f7f3ee;font-family:Arial,sans-serif;color:#172033}
            .ticket-print{box-sizing:border-box;width:210mm;height:297mm;margin:auto;background:#fff;padding:14mm;overflow:hidden}
            .ticket-print table{width:100%;border-collapse:collapse;margin-top:8px}
            .ticket-print table th{background:#172033;color:#fff;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;padding:9px}
            .ticket-print table td{border-bottom:1px solid #e2e8f0;padding:9px;font-size:11px;vertical-align:top}
            .ticket-print table tr:nth-child(even) td{background:#fff8f4}
            .status{display:inline-block;border-radius:999px;background:#dcfce7;color:#166534;padding:3px 8px;font-size:9px;font-weight:700}
            .ticket-print .summary-box{border-radius:12px;background:#f2edff;padding:12px}
            h1{font-size:24px!important;margin:4px 0!important}
            h2{font-size:15px!important;margin:8px 0!important}
            p{margin:3px 0!important;font-size:11px!important;line-height:1.35}
            .ticket-print img{max-height:42px;width:42px}
            .label{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.08em}
            .value{font-weight:700;margin-top:4px}
            @media print{body{background:#fff}.ticket-print{box-shadow:none}}
          </style></head><body>
          <div class="ticket-print">${printRef.current.innerHTML}</div>
          </body></html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    const element = printRef.current;
    if (!element) return;

    const html2canvas = require("html2canvas");
    const jsPDF = require("jspdf");

    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 277);
      pdf.save(`${booking?.event?.title}-tickets.pdf`);
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[calc(100%-32px)]">
          <div className="text-center py-12">Loading tickets...</div>
        </div>
      </main>
    );
  }

  if (!booking || booking.status !== "CONFIRMED" || !booking.tickets) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[calc(100%-32px)]">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/bookings">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to bookings
            </Link>
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">
                No tickets found for this booking.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[calc(100%-32px)]">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/bookings">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to bookings
          </Link>
        </Button>

        <div className="flex gap-2 mb-6">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <div ref={printRef} className="ticket-print mx-auto min-h-[1123px] max-w-[794px] overflow-hidden rounded-3xl bg-white p-8 text-sm shadow-sm">
          <div className="border-b-2 border-[var(--coral)] pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--coral)]">Bengal Booking</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{booking.event?.title}</h1>
            <p className="mt-2 max-w-2xl text-slate-600">{booking.event?.description}</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <p><strong>Date:</strong> {new Date(booking.event?.startAt || "").toLocaleString()}</p>
              <p><strong>Venue:</strong> {booking.event?.venueName}, {booking.event?.venueAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-[var(--lavender)] p-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200">
              {booking.event?.seller?.image ? (
                <Image src={booking.event.seller.image} alt={booking.event.seller.name} fill className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-lg font-bold text-slate-500">
                  {booking.event?.seller?.name?.charAt(0).toUpperCase() ?? "O"}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Organizer</p>
              <p className="font-bold">{booking.event?.seller?.name ?? "Event organizer"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-center sm:grid-cols-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Booking ID</p>
              <p className="font-mono text-sm font-bold">{compactBookingId(booking.id)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Tickets</p>
              <p className="font-bold text-lg">{booking.tickets.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Booking Status</p>
              <p className="font-bold text-green-700">{booking.status}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Payment</p>
              <p className="font-bold">{booking.payment?.status ?? "SUCCESS"}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--coral)]">Admission details</p>
                <h2 className="mt-1 text-lg font-bold">Your tickets</h2>
              </div>
              <p className="text-xs text-slate-500">{booking.tickets.length} ticket{booking.tickets.length === 1 ? "" : "s"}</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-900 text-xs uppercase tracking-wider text-white">
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
                    <tr key={ticket.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2.5 font-bold">{ticket.name}</td>
                      <td className="max-w-[180px] px-3 py-2.5 text-xs text-slate-600">{ticket.description || "—"}</td>
                      <td className="px-3 py-2.5 font-mono text-xs">{compactBookingId(ticket.id)}</td>
                      <td className="px-3 py-2.5">
                        <Badge className={`status ${ticket.status === "SOLD" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{ticket.status}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold">৳{Number(ticket.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 border-t pt-5 text-sm sm:grid-cols-2">
            <div className="summary-box">
              <h2 className="mb-3 font-bold">Booking information</h2>
              <p><span className="text-slate-500">Name:</span> {booking.buyerName}</p>
              <p><span className="text-slate-500">Phone:</span> {booking.buyerPhone}</p>
              <p><span className="text-slate-500">Address:</span> {booking.buyerAddress}</p>
            </div>
            <div className="summary-box sm:text-right">
              <h2 className="mb-3 font-bold">Order summary</h2>
              <p><span className="text-slate-500">Booked:</span>{" "}
              Booking Date:{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              </p>
              <p className="mt-1 font-bold">Amount paid: ৳ {Number(booking.totalAmount).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
