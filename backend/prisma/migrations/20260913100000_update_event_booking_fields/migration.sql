-- Add image metadata and event booking/payment rules.
ALTER TABLE "Division" ADD COLUMN "image" TEXT;
ALTER TABLE "Category" ADD COLUMN "image" TEXT;

CREATE TYPE "PaymentType" AS ENUM ('Advance', 'OnArrival', 'Free');
ALTER TABLE "Event"
  ADD COLUMN "lastDateAndTimeOfCancel" TIMESTAMP(3),
  ADD COLUMN "lastDateOfBooking" TIMESTAMP(3),
  ADD COLUMN "paymentType" "PaymentType" NOT NULL DEFAULT 'Free';

ALTER TABLE "Event"
  DROP COLUMN "price",
  DROP COLUMN "totalTickets",
  DROP COLUMN "soldTickets";

ALTER TABLE "Booking"
  ADD COLUMN "buyerName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "buyerAddress" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "buyerPhone" TEXT NOT NULL DEFAULT '';

DROP INDEX "Ticket_eventId_ticketNumber_key";
ALTER TABLE "Ticket" DROP COLUMN "ticketNumber";
