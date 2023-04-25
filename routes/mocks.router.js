import { Router } from "express";

import { generateProducts } from "../tests/mocks/products.mock.js";
import { generateUsers } from "../tests/mocks/users.mock.js";

const mocksRouter = Router();

mocksRouter.get("/mockingproducts", (req, res, next)=>{
    try {
        let qty = req.query.qty || 50;
    
        const products = generateProducts(qty);
    
        res.send({status:"success", payload:products});
    } catch (error) {
        next(error);
    }
})

mocksRouter.get("/mockingusers", (req, res, next)=>{
    try {
        let qty = req.query.qty || 20;
    
        const users = generateUsers(qty);
    
        res.send({status:"success", payload:users});
    } catch (error) {
        next(error);
    }
})

export default mocksRouter;