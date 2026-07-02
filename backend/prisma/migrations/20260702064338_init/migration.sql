-- CreateTable
CREATE TABLE "scores" (
    "id" SERIAL NOT NULL,
    "sbd" VARCHAR(16) NOT NULL,
    "toan" DOUBLE PRECISION,
    "ngu_van" DOUBLE PRECISION,
    "ngoai_ngu" DOUBLE PRECISION,
    "vat_li" DOUBLE PRECISION,
    "hoa_hoc" DOUBLE PRECISION,
    "sinh_hoc" DOUBLE PRECISION,
    "lich_su" DOUBLE PRECISION,
    "dia_li" DOUBLE PRECISION,
    "gdcd" DOUBLE PRECISION,
    "ma_ngoai_ngu" VARCHAR(8),

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scores_sbd_key" ON "scores"("sbd");

-- CreateIndex
CREATE INDEX "scores_toan_idx" ON "scores"("toan");

-- CreateIndex
CREATE INDEX "scores_vat_li_idx" ON "scores"("vat_li");

-- CreateIndex
CREATE INDEX "scores_hoa_hoc_idx" ON "scores"("hoa_hoc");
