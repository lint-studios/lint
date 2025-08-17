-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ready',
    "reportType" TEXT NOT NULL,
    "reportStartDate" TIMESTAMP(3) NOT NULL,
    "reportEndDate" TIMESTAMP(3) NOT NULL,
    "googleDriveUrl" TEXT,
    "highlights" JSONB,
    "metadata" JSONB,
    "sourcesCount" INTEGER NOT NULL DEFAULT 0,
    "productsAnalyzed" INTEGER NOT NULL DEFAULT 0,
    "reviewsAnalyzed" INTEGER NOT NULL DEFAULT 0,
    "sentimentScore" DOUBLE PRECISION,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastDownloaded" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
