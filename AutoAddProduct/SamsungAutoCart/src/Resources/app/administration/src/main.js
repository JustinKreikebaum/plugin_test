import './page/sw-product-detail';
import './view/sw-product-detail-custom';

Shopware.Module.register('sw-new-tab-custom', {
    routeMiddleware(next, currentRoute) {
        const customRouteName = 'sw.product.detail.custom';
    
        if (
            currentRoute.name === 'sw.product.detail' 
            && currentRoute.children.every((currentRoute) => currentRoute.name !== customRouteName)
        ) {
            currentRoute.children.push({
                name: customRouteName,
                path: '/sw/product/detail/:id/custom',
                component: 'sw-product-detail-custom',
                meta: {
                    parentPath: 'sw.product.index'
                }
            });
        }
        next(currentRoute);
    }
});