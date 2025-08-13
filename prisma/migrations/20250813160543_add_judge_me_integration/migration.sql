-- CreateTable
CREATE TABLE "public"."api_tokens" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "encryptedToken" TEXT,
    "iv" TEXT,
    "tag" TEXT,
    "plainTextData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "productId" TEXT,
    "productTitle" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "reviewerName" TEXT,
    "reviewerEmail" TEXT,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'judge_me',
    "rawData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_tokens_organizationId_service_key" ON "public"."api_tokens"("organizationId", "service");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_organizationId_externalId_source_key" ON "public"."reviews"("organizationId", "externalId", "source");

-- AddForeignKey
ALTER TABLE "public"."api_tokens" ADD CONSTRAINT "api_tokens_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
