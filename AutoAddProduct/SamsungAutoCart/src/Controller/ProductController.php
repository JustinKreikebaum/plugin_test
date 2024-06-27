<?php declare(strict_types=1);

namespace MtfSamsung\Controller;

use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\Context;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ProductController
{
    private $productRepository;

    public function __construct(EntityRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * @Route("/api/v{version}/_action/samsung-auto-cart/get-product-numbers", name="api.action.samsung_auto_cart.get_product_numbers", methods={"GET"})
     */
    public function getProductNumbers(Context $context): JsonResponse
    {
        $criteria = new Criteria();
        $criteria->setLimit(100); // Set limit if needed
        $products = $this->productRepository->search($criteria, $context)->getEntities();

        $productNumbers = [];
        foreach ($products as $product) {
            $productNumbers[] = $product->get('productNumber');
        }

        return new JsonResponse($productNumbers);
    }
}
