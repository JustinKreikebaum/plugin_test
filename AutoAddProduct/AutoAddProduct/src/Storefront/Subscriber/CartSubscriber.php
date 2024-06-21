<?php declare(strict_types=1);

namespace AutoAddProduct\Storefront\Subscriber;

use Shopware\Core\Checkout\Cart\Cart;
use Shopware\Core\Checkout\Cart\Event\CartChangedEvent;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Cart\SalesChannel\CartService;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface; // <-- Korrekte Schnittstelle
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CartSubscriber implements EventSubscriberInterface
{
    private EntityRepositoryInterface $productMappingRepository;
    private CartService $cartService;

    public function __construct(EntityRepositoryInterface $productMappingRepository, CartService $cartService) // <-- Korrekte Schnittstelle
    {
        $this->productMappingRepository = $productMappingRepository;
        $this->cartService = $cartService;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CartChangedEvent::class => 'onCartChanged',
        ];
    }

    public function onCartChanged(CartChangedEvent $event): void
    {
        $cart = $event->getCart();
        $context = $event->getSalesChannelContext();

        foreach ($cart->getLineItems() as $lineItem) {
            $this->addAdditionalProduct($lineItem, $cart, $context);
        }
    }

    private function addAdditionalProduct(LineItem $lineItem, Cart $cart, SalesChannelContext $context): void
    {
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('referenceProductId', $lineItem->getReferencedId()));
        $productMapping = $this->productMappingRepository->search($criteria, $context->getContext())->first();

        if ($productMapping && !$this->cartContainsProduct($cart, $productMapping->get('additionalProductId'))) {
            $additionalProduct = new LineItem(
                $productMapping->get('additionalProductId'),
                LineItem::PRODUCT_LINE_ITEM_TYPE,
                $productMapping->get('additionalProductId')
            );
            $additionalProduct->setLabel('Additional Product');

            $this->cartService->add($cart, $additionalProduct, $context);
        }
    }

    private function cartContainsProduct(Cart $cart, string $productId): bool
    {
        foreach ($cart->getLineItems() as $lineItem) {
            if ($lineItem->getReferencedId() === $productId) {
                return true;
            }
        }
        return false;
    }
}
