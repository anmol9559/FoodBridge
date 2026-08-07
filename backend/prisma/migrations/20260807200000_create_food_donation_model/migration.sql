-- CreateTable
CREATE TABLE `FoodDonation` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `quantityUnit` VARCHAR(50) NOT NULL,
    `foodType` ENUM('COOKED', 'PACKAGED', 'RAW', 'BAKERY', 'BEVERAGE', 'OTHER') NOT NULL,
    `mealType` VARCHAR(50) NULL,
    `packagingType` VARCHAR(100) NULL,
    `isVegetarian` BOOLEAN NOT NULL DEFAULT false,
    `isVegan` BOOLEAN NOT NULL DEFAULT false,
    `cookedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `pickupAddress` TEXT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `estimatedServings` INTEGER NULL,
    `specialInstructions` TEXT NULL,
    `images` JSON NULL,
    `status` ENUM('AVAILABLE', 'RESERVED', 'APPROVED', 'PICKED_UP', 'COLLECTED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'AVAILABLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `FoodDonation_restaurantId_idx`(`restaurantId`),
    INDEX `FoodDonation_status_expiresAt_idx`(`status`, `expiresAt`),
    INDEX `FoodDonation_foodType_status_idx`(`foodType`, `status`),
    INDEX `FoodDonation_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `FoodDonation_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoodDonation` ADD CONSTRAINT `FoodDonation_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
