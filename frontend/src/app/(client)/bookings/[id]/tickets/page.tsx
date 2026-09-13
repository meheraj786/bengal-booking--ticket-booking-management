"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, ChevronLeft } from "lucide-react";
import { useRef } from "react";

export default function TicketsPage() {
  const params = useParams();
  const bookingId = params?.id as string;
  const { data: booking, isLoading } = useBooking(bookingId);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(printRef.current.innerHTML);
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

        <div ref={printRef} className="bg-white p-8 space-y-6">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold">{booking.event?.title}</h1>
            <p className="text-gray-600 mt-2">{booking.event?.venueName}</p>
            <p className="text-sm text-gray-500">
              {new Date(booking.event?.startAt || "").toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-gray-600 text-sm mb-1">Booking ID</p>
              <p className="font-mono font-bold">{booking.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Tickets</p>
              <p className="font-bold text-lg">{booking.tickets.length}</p>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            <h2 className="font-bold text-lg mb-4">Your Tickets</h2>
            {booking.tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50"
              >
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Ticket Name</p>
                    <p className="font-bold text-xl">{ticket.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Ticket ID</p>
                    <p className="font-mono text-sm">
                      {ticket.id.slice(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Status</p>
                    <Badge className="bg-green-100 text-green-800">VALID</Badge>
                  </div>
                </div>
                {ticket.description && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
                    {ticket.description}
                  </div>
                )}
                <p className="mt-2 text-sm font-medium">
                  Price: ৳{Number(ticket.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 mt-8 text-center">
            <p className="text-xs text-gray-500">
              Booking Date:{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Amount Paid: ৳ {Number(booking.totalAmount).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
