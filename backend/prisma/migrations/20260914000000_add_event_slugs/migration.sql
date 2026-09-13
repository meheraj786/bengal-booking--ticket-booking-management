ALTER TABLE "Event" ADD COLUMN "slug" TEXT;

UPDATE "Event"
SET "slug" = regexp_replace(
  lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g')),
  '(^-+|-+$)',
  '',
  'g'
) || '-' || substring("id", 1, 8);

ALTER TABLE "Event" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
