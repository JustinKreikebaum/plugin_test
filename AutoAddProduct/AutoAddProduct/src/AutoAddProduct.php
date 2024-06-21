<?php declare(strict_types=1);

namespace AutoAddProduct;

use Shopware\Core\Framework\Plugin;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class AutoAddProduct extends Plugin
{
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);
    }
}
