-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" DEFAULT 'CASH',
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingInfo" JSONB;
