import express from 'express';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import viewsRouter from './routes/views.router.js';
import { Socket } from 'engine.io';

const app = express();
app.use(express.json());
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
    console.log("Servidor corriendo");
});

const io = new Server(httpServer);

let products = [
    {
        id: 1,
        nombre: "producto1",
    },
    {
        id: 2,
        nombre: "producto2"
    },
    {
        id: 3,
        nombre: "producto3"
    }
]

function mandarProductos() {
    io.emit("productosLog", products);
}

io.on("connection", (socket) => {
    
    mandarProductos();

    socket.on("new", data => {
        const id = products[products.length - 1];
        let nuevo = { 
            id: id.id + 1,
            nombre: data
        }
        products.push(nuevo);
        mandarProductos();
    });

    socket.on("eliminar", data => {
        let pIndex = products.findIndex(p => p.id === parseInt(data));
        if (pIndex === -1) {
            console.log("Producto no encontrado");
            return;
        }
        products.splice(pIndex, 1);
        mandarProductos();
    });

    socket.on("editar", data => {
        let pIndex = products.findIndex(i => i.id === parseInt(data.id));
        if (pIndex === -1) {
            console.log("Producto no encontrado");
            return;
        }
        products[pIndex] = data;
        mandarProductos();
    });
})
