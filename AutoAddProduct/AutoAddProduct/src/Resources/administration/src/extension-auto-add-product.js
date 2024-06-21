const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.override('sw-product-detail', {
    template,

    data() {
        return {
            additionalProductId: null,
        };
    },

    methods: {
        loadProductData() {
            const criteria = new Criteria();
            criteria.addFilter(Criteria.equals('productMapping.referenceProductId', this.product.id));

            this.repository.search(criteria, Shopware.Context.api).then((result) => {
                if (result.total > 0) {
                    this.additionalProductId = result[0].additionalProductId;
                }
            });
        },

        saveProductData() {
            const entity = this.repository.create(Shopware.Context.api);
            entity.referenceProductId = this.product.id;
            entity.additionalProductId = this.additionalProductId;

            this.repository.save(entity, Shopware.Context.api);
        },
    },

    created() {
        this.loadProductData();
    },
});
