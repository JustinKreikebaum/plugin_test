import template from './sw-product-detail.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.override('sw-product-detail', {
    template,

    data() {
        return {
            additionalProductId: null,
        };
    },

    computed: {
        productRepository() {
            return this.repositoryFactory.create('product');
        },

        productMappingRepository() {
            return this.repositoryFactory.create('product_mapping');
        },
    },

    methods: {
        loadProductData() {
            const criteria = new Criteria();
            criteria.addFilter(Criteria.equals('referenceProductId', this.product.id));

            this.productMappingRepository.search(criteria, Shopware.Context.api).then((result) => {
                if (result.total > 0) {
                    this.additionalProductId = result.first().additionalProductId;
                }
            });
        },

        saveProductData() {
            const entity = this.productMappingRepository.create(Shopware.Context.api);
            entity.referenceProductId = this.product.id;
            entity.additionalProductId = this.additionalProductId;

            this.productMappingRepository.save(entity, Shopware.Context.api);
        },
    },

    created() {
        this.loadProductData();
    },
});
