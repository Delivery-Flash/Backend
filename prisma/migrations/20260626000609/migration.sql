-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'RIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('AVAILABLE', 'ACCEPTED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTO', 'BICICLETA', 'CARRO', 'A_PIE');

-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('PEDIDO_CREADO', 'PEDIDO_ACEPTADO', 'EN_CAMINO', 'ENTREGADO', 'CALIFICACION_RECIBIDA', 'PAGO_PROCESADO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "profile_photo" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderProfile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "license_plate" TEXT NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL DEFAULT 'MOTO',
    "vehicle_model" TEXT,
    "zone" TEXT NOT NULL DEFAULT 'ZONA_1',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "rider_id" INTEGER,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "zone" TEXT NOT NULL DEFAULT 'ZONA_1',
    "status" "OrderStatus" NOT NULL DEFAULT 'AVAILABLE',
    "distance_km" DECIMAL(8,2),
    "suggested_price" DECIMAL(10,2),
    "base_fare" DECIMAL(10,2),
    "final_price" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "rider_id" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderEarnings" (
    "id" SERIAL NOT NULL,
    "rider_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "gross_amount" DECIMAL(10,2) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "net_amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiderEarnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "type" "NotifType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_user_id_key" ON "RiderProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_order_id_key" ON "Rating"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "RiderEarnings_order_id_key" ON "RiderEarnings"("order_id");

-- AddForeignKey
ALTER TABLE "RiderProfile" ADD CONSTRAINT "RiderProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderEarnings" ADD CONSTRAINT "RiderEarnings_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderEarnings" ADD CONSTRAINT "RiderEarnings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
