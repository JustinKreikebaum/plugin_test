
import template from './sw-product-detail.html.twig';

Shopware.Component.override('sw-product-detail', {
    template,

    inject: ['systemConfigApiService'],

    methods: {
        async onSave() {
            // Call the original save method
            this.$super('onSave');

            // Call the custom save method from our component
            const customComponent = this.$refs['sw-product-detail-custom'];
            if (customComponent && typeof customComponent.saveSelectedProduct === 'function') {
                await customComponent.saveSelectedProduct();
            }
        }
    }
});
