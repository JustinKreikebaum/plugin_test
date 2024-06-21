<?php declare(strict_types=1);

namespace AutoAddProduct\Migrations;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1630000000CreateProductMappingTable extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1630000000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `product_mapping` (
                `id` BINARY(16) NOT NULL,
                `reference_product_id` BINARY(16) NOT NULL,
                `additional_product_id` BINARY(16) NOT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
