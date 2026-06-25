-- CreateEnum
CREATE TYPE "ContingencyStatus" AS ENUM ('RECEIVED', 'IN_PROCESS', 'ATTENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContingencySituation" AS ENUM ('SAFE', 'INJURED', 'DISPLACED', 'MISSING_FAMILY', 'DECEASED', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContingencyCensus" (
    "id" TEXT NOT NULL,
    "fileNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "management" TEXT NOT NULL,
    "currentLocation" TEXT NOT NULL,
    "currentSituation" "ContingencySituation" NOT NULL,
    "situationOther" TEXT,
    "needsSupport" BOOLEAN NOT NULL DEFAULT false,
    "needsMedicine" BOOLEAN NOT NULL DEFAULT false,
    "medicineDetail" TEXT,
    "needsFood" BOOLEAN NOT NULL DEFAULT false,
    "needsHousing" BOOLEAN NOT NULL DEFAULT false,
    "affectedPeople" INTEGER NOT NULL DEFAULT 1,
    "observations" TEXT,
    "status" "ContingencyStatus" NOT NULL DEFAULT 'RECEIVED',
    "reportedById" TEXT,
    "statusChangedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContingencyCensus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ContingencyCensus_fileNumber_key" ON "ContingencyCensus"("fileNumber");

-- CreateIndex
CREATE INDEX "ContingencyCensus_status_createdAt_idx" ON "ContingencyCensus"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContingencyCensus_cedula_idx" ON "ContingencyCensus"("cedula");

-- CreateIndex
CREATE INDEX "ContingencyCensus_management_idx" ON "ContingencyCensus"("management");

-- CreateIndex
CREATE INDEX "ContingencyCensus_needsMedicine_needsFood_needsHousing_idx" ON "ContingencyCensus"("needsMedicine", "needsFood", "needsHousing");

-- CreateIndex
CREATE INDEX "ContingencyCensus_currentSituation_idx" ON "ContingencyCensus"("currentSituation");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "ContingencyCensus" ADD CONSTRAINT "ContingencyCensus_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContingencyCensus" ADD CONSTRAINT "ContingencyCensus_statusChangedById_fkey" FOREIGN KEY ("statusChangedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
