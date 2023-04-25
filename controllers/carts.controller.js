import CartService from "../services/carts.service.js";

class CartController{
    constructor(){
        this.cartService = new CartService();
    }

    getCart(id, populated=true){
        return this.cartService.getCart(id, populated);
    }

    addCart(cart){
        return this.cartService.addCart(cart);
    }

    addProductToCart(cartId, productId){
        return this.cartService.addProductToCart(cartId, productId);
    }

    updateCart(id, products){
        return this.cartService.updateCart(id, products);
    }

    updateProdQty(cartId, productId, qty){
        return this.cartService.updateProdQty(cartId, productId, qty);
    }

    deleteProduct(cartId, productId){
        return this.cartService.deleteProduct(cartId, productId);
    }

    deleteAllProducts(cartId){
        return this.cartService.deleteAllProducts(cartId);
    }
}

export default CartController;