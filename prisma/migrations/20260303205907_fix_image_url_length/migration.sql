-- AlterTable
ALTER TABLE `CartItem` MODIFY `image` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Category` MODIFY `image` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `image` LONGTEXT NOT NULL;
