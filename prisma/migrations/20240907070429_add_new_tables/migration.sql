-- CreateTable
CREATE TABLE "Requests" (
    "wcaid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "country" TEXT,
    "gender" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("wcaid")
);

-- CreateTable
CREATE TABLE "Members" (
    "wcaid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "country" TEXT,
    "gender" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("wcaid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Requests_wcaid_key" ON "Requests"("wcaid");

-- CreateIndex
CREATE UNIQUE INDEX "Members_wcaid_key" ON "Members"("wcaid");
