-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "nhlId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "positionCode" TEXT NOT NULL,
    "sweaterNumber" INTEGER NOT NULL,
    "shootsCatches" TEXT NOT NULL,
    "heightInInches" INTEGER NOT NULL,
    "weightInPounds" INTEGER NOT NULL,
    "birthCity" TEXT,
    "birthCountry" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_nhlId_key" ON "Player"("nhlId");
