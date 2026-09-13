"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import type { Ticket as TicketType } from "@/types/booking.types";

interface BookingTicketCardProps {
  ticket: TicketType;
  eventTitle: string;
  eventDate: string;
}

const ticketStatusColors: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  LOCKED: "bg-yellow-100 text-yellow-800",
  SOLD: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function BookingTicketCard({
  ticket,
  eventTitle,
  eventDate,
}: BookingTicketCardProps) {
  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Ticket className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                Ticket #{ticket.id.slice(0, 8)}
              </p>
              <p className="font-medium text-sm">{ticket.name}</p>
              <p className="text-xs text-gray-600">{eventTitle}</p>
              <p className="text-xs text-gray-600">{eventDate}</p>
              {ticket.description && (
                <p className="text-xs text-gray-500 mt-1">{ticket.description}</p>
              )}
              <p className="text-xs font-medium text-gray-700 mt-1">
                ৳{Number(ticket.price).toLocaleString()} per ticket
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <Badge className={ticketStatusColors[ticket.status]}>
              {ticket.status}
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              {ticket.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
