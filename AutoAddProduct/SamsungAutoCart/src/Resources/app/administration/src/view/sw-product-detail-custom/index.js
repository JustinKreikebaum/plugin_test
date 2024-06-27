
import template from './sw-product-detail-custom.html.twig';

const { Component, Data, Mixin } = Shopware;
const { Criteria } = Data;

Component.register('sw-product-detail-custom', {
    template,
    inject: ['repositoryFactory', 'systemConfigApiService'],
    mixins: [
        Mixin.getByName('notification')
    ],
    data() {
        return {
            productNumbers: [],
            selectedProduct: null,
            isLoading: false,
            productRepository: null,
            productId: null
        };
    },
    created() {
        this.productRepository = this.repositoryFactory.create('product');
        this.productId = this.$route.params.id;
        this.loadProductNumbers();
        this.loadSelectedProduct();
    },
    methods: {
        async loadProductNumbers() {
            this.isLoading = true;
            try {
                const response = await this.productRepository.search(new Criteria(), Shopware.Context.api);
                this.productNumbers = response.map(product => ({
                    id: product.id,
                    label: product.name,
                    value: product.id
                }));
                // Ensure the selected product is updated after loading product numbers
                if (this.selectedProduct) {
                    this.selectedProduct = this.productNumbers.find(product => product.id === this.selectedProduct.id) || null;
                }
            } catch (error) {
                console.error('Error loading product numbers:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async loadSelectedProduct() {
            this.isLoading = true;
            try {
                const product = await this.productRepository.get(this.productId, Shopware.Context.api);
                const selectedProduct = product.extensions?.MtfSamsung?.selectedProduct || null;
                this.selectedProduct = this.productNumbers.find(product => product.id === selectedProduct) || null;
            } catch (error) {
                console.error('Error loading selected product:', error);
            } finally {
                this.isLoading = false;
            }
        },
        onSave() {
            this.saveSelectedProduct();
        },
        async saveSelectedProduct() {
            this.isLoading = true;
            try {
                const product = await this.productRepository.get(this.productId, Shopware.Context.api);
                product.extensions = {
                    ...product.extensions,
                    MtfSamsung: {
                        selectedProduct: this.selectedProduct.id
                    }
                };
                await this.productRepository.save(product, Shopware.Context.api);
                this.createNotificationSuccess({
                    title: this.$tc('global.default.success'),
                    message: this.$tc('global.default.successMessage')
                });
            } catch (error) {
                console.error('Error saving selected product:', error);
                this.createNotificationError({
                    title: this.$tc('global.default.error'),
                    message: this.$tc('global.notification.notificationSaveErrorMessage')
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
});
