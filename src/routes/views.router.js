import { Router  } from "express";

const viewsRouter = Router();

viewsRouter.get("/products", (req, res) => {
    res.render("index");
})

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
})

export default viewsRouter;