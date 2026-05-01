-- CreateIndex
CREATE INDEX "Player_lastName_idx" ON "Player"("lastName");

-- CreateIndex
CREATE INDEX "Player_positionCode_idx" ON "Player"("positionCode");

-- CreateIndex
CREATE INDEX "Player_birthCountry_idx" ON "Player"("birthCountry");

-- CreateIndex
CREATE INDEX "Player_shootsCatches_idx" ON "Player"("shootsCatches");

-- CreateIndex
CREATE INDEX "Player_positionCode_shootsCatches_idx" ON "Player"("positionCode", "shootsCatches");
