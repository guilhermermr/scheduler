/*
  Warnings:

  - Added the required column `clientEmail` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL;
