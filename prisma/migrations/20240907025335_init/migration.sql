-- CreateTable
CREATE TABLE "Users" (
    "wcaid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "country" TEXT,
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("wcaid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_wcaid_key" ON "Users"("wcaid");
