-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Teacher', 'Student');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('Automn', 'Spring');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "roomId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "season" "Season" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("roomId","fieldId","year","season")
);

-- CreateTable
CREATE TABLE "Teaching" (
    "teacherId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "season" "Season" NOT NULL,

    CONSTRAINT "Teaching_pkey" PRIMARY KEY ("teacherId","roomId","fieldId","year","season")
);

-- CreateTable
CREATE TABLE "Learning" (
    "studentId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "season" "Season" NOT NULL,

    CONSTRAINT "Learning_pkey" PRIMARY KEY ("studentId","roomId","fieldId","year","season")
);

-- CreateTable
CREATE TABLE "Assignements" (
    "roomId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "season" "Season" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "estimated_time" INTEGER NOT NULL,

    CONSTRAINT "Assignements_pkey" PRIMARY KEY ("roomId","fieldId","year","season")
);

-- CreateTable
CREATE TABLE "Semester" (
    "year" INTEGER NOT NULL,
    "season" "Season" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("year","season")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_number_key" ON "Room"("number");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_year_season_fkey" FOREIGN KEY ("year", "season") REFERENCES "Semester"("year", "season") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teaching" ADD CONSTRAINT "Teaching_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teaching" ADD CONSTRAINT "Teaching_roomId_fieldId_year_season_fkey" FOREIGN KEY ("roomId", "fieldId", "year", "season") REFERENCES "Course"("roomId", "fieldId", "year", "season") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learning" ADD CONSTRAINT "Learning_roomId_fieldId_year_season_fkey" FOREIGN KEY ("roomId", "fieldId", "year", "season") REFERENCES "Course"("roomId", "fieldId", "year", "season") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignements" ADD CONSTRAINT "Assignements_roomId_fieldId_year_season_fkey" FOREIGN KEY ("roomId", "fieldId", "year", "season") REFERENCES "Course"("roomId", "fieldId", "year", "season") ON DELETE RESTRICT ON UPDATE CASCADE;
