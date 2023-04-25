import ProductService from "../services/products.service.js";
import config from "../config/config.js";

class ProductController{
    constructor(){
        this.productService = new ProductService();
    }

    getProducts(limit=10, page=1, query="{}", sort=1){
        return this.productService.getProducts(limit, page, query, sort);
    }

    getProduct(id){
        return this.productService.getProduct(id);
    }

    addProduct(product){
        return this.productService.addProduct(product);
    }

    updateProduct(id, newData){
        return this.productService.updateProduct(id, newData);
    }

    deleteProduct(id){
        return this.productService.deleteProduct(id);
    }
}

export default ProductController;