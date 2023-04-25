import { Router } from "express";

import ProductController from "../controllers/products.controller.js";
import CartController from "../controllers/carts.controller.js";
import MessageDbDAO from "../daos/message.db.dao.js";
import { handlePolicies } from "../utils.js";


const viewsRouter = Router();

const productController = new ProductController();
const cartController = new CartController();
const messageDB = new MessageDbDAO();

viewsRouter.get("/", async (req, res, next)=>{
    try {
        res.redirect("/products");
    } catch (error) {
        next(error);
    }
})

viewsRouter.get("/products", async (req, res, next)=>{
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const query = req.query.query || "";
        const sort = req.query.sort || 1;

        const products = await productController.getProducts(limit, page, query, sort);

        products.payload = products.products;

        // Agregado de objeto de paginacion
        products.pagination = {
            active: true,
            prevLink: products.prevLink,
            pagesLinks: [],
            nextLink: products.nextLink
        };

        // Calculo de cantidad de paginas a mostrar.
        let numLinkPages = (products.totalPages > 5) ? 5 : products.totalPages;
        let midPageDif = 1;

        // Armado de paginas
        for (let i = 1; i <= numLinkPages; i++) {
            let actualPage;                                     // Numero de la pagina a mostrar.
            let middleCicle = Math.ceil(numLinkPages/2);        // Numero medio del ciclo.
            let middlePage = products.page;                     // Numero de la pagina media.

            // Cambio del ciclo medio segun posicion de la pagina a presentar como activa.
            if(products.page < middleCicle){
                middleCicle = products.page;
            }else if(products.page > (products.totalPages-middleCicle)){
                middleCicle = numLinkPages-(products.totalPages-products.page);
            }

            // Seteo de pagina a mostrar dependiendo de si se encuentra a los lados de la pagina media.
            if(i < middleCicle){
                actualPage = (middlePage-middleCicle)+midPageDif;
                midPageDif++;
            }else if(i === middleCicle){
                actualPage = middlePage;
                midPageDif=1;
            }else{
                actualPage = middlePage+midPageDif;
                midPageDif++;
            }

            // Armado del objeto pageLink.
            let pageLink = {
                page:actualPage,
                link:`http://localhost:8080/products?limit=${limit}&page=${actualPage}&sort=${sort}&query=${query}`,
                active: products.page === actualPage
            }

            products.pagination.pagesLinks.push(pageLink);
        }

        if(products.totalPages <= 1) products.pagination.active = false;

        res.render("products", {products});
    } catch (error) {
        next(error);
    }
})

viewsRouter.get("/products/:pid", async (req, res, next)=>{
    try {
        const productId = req.params.pid;

        let product = await productController.getProduct(productId);

        product.thumbnails = product.thumbnails.map(thumbnail => (thumbnail.match(/^img/i)) ? '../'+thumbnail : thumbnail);

        res.render("productDetail", {product: product});
    } catch (error) {
        next(error);
    }
})

viewsRouter.get("/realtimeproducts", async (req, res, next)=>{
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const query = req.query.query || '';
        const sort = req.query.sort || 1;
    
        const products = await productController.getProducts(limit, page, query, sort);

        res.render("realTimeProducts", {products:products.products});
    } catch (error) {
        next(error);
    }

})

viewsRouter.get("/carts/:cid", privateView, async (req, res, next)=>{
    try {
        const cartId = req.params.cid;

        let cart = await cartController.getCart(cartId);

        cart.products.map(prod=>{
            prod.totalPrice = (prod.product.price*prod.quantity).toFixed(2);
            
            return prod;
        })

        res.render("cart", {cart, cartId});
    } catch (error) {
        next(error);
    }
})

viewsRouter.get("/register", publicView, (req, res)=>{
    const validation = Number(req.query.validation);
    let message = '';

    switch(validation){
        case 0:
            message = "Error al registrar al usuario, por favor intentelo de nuevo.";
        case 1:
            message = "Ya existe un usuario vinculado a ese mail, inicie sesion.";
    }

    res.render("register", {message});
})

viewsRouter.get("/login", publicView, (req, res)=>{
    const validation = Number(req.query.validation);
    const isLogout = Number(req.query.logout);
    const isRegister = Number(req.query.register);
    let message = "";

    switch (validation) {
        case 0:
            message = "No se encontro usuario con esas credenciales. Por favor vuelva a intentar.";
            break;
        case 1:
            message = "Solo usuarios registrados pueden acceder.";
            break;
        case 2:
            message = "La contraseña es incorrecta. Vuelva a intentarlo.";
    }

    if(!!isRegister) message = "Registro exitoso! Inicie sesión para comenzar.";    
    if(!!isLogout) message = "Por favor, inicie sesión nuevamente para utilizar todas las funciones.";
    
    res.render("login", {message});
})

viewsRouter.get("/profile", privateView, (req, res)=>{
    res.render("profile");
})

viewsRouter.get("/chat", privateView, handlePolicies(["USER"]), async (req, res)=>{
    let messages = await messageDB.getMessages();

    res.render("chat", {messages});
})


function privateView(req, res, next){       
    if(!!!req.session.passport?.user) return res.redirect("/login?validation=1");

    next();
}

function publicView(req, res, next){        
    if(!!req.session.passport?.user) return res.redirect('/profile');

    next();
}

export default viewsRouter;