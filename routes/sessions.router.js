import { Router } from "express";
import passport from "passport";

import config from "../config/config.js";
import { authToken, generateToken } from "../utils.js";

const sessionsRouter = Router();

sessionsRouter.post("/register", (req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
        if(err) return next(err);
        if(!user) return res.status(409).send({status:"error", message: info.message ? info : {message:"Error de registro", valCode:0}});

        res.send({status:"success", message:"Usuario registrado con exito!"});
    })(req, res, next)
})

sessionsRouter.get("/failregister", (req, res)=>{
    console.log("Error en estrategia de registro.");
    res.send({status:"error", message:"Error en estrategia de registro"});
})

sessionsRouter.post("/login", (req, res, next)=>{
    passport.authenticate("login", (err, user, info)=>{
        if(err) return next(err);
        if(!user) return res.status(404).send({status: "error", message: info.message ? info : {message:"Error de autenticacion", valCode:0}});

        if (config.login_strategy.toUpperCase() === "JWT") {
            const user_jwt = generateToken(user);
            return res.cookie("user_jwt", user_jwt, {maxAge:60*60*1000, httpOnly:true}).send({status:"success", message:"Usuario logeado con exito."});
        }else{
            req.login(user, loginErr=>{
                if(loginErr) return next(loginErr);

                return res.send({status:'success', message:"Usuario logeado con exito."});
            })
        }
    })(req, res, next)
})

sessionsRouter.get("/faillogin", (req, res)=>{
    console.log("Error de login.");
    res.status(404).send({status: "error", message: {message:"Error de autenticacion", valCode:0}});
})

sessionsRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}), (req, res)=>{})

sessionsRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login?validation=2"}), (req, res)=>{
    res.redirect("/");
})

sessionsRouter.get("/current", passport.authenticate("jwt", {session:false}), (req, res)=>{
    res.send({status:"success", payload:req.user});
})

sessionsRouter.get("/logout", (req, res)=>{
    req.session.destroy(err=>{
        if(err) res.send({status:"error", message:"Error al cerrar la sesión: "+err});
        res.redirect("/login?logout=1");
    });
})

export default sessionsRouter;