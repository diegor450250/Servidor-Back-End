const socket = io();

const form = document.getElementById("newP");
const nombre = document.querySelector("input");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(nombre.value) {
        socket.emit("new", nombre.value);
        nombre.value = "";
    }
})

socket.on("productosLog", (data) => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = '';
    data.forEach(element => {
        const divP = document.createElement("div")
        let product = document.createElement("p");
        let editarP = document.createElement("button");
        let inputP = document.createElement("input");
        let eliminarP = document.createElement("button");
        product.textContent = "Id: " + element.id + ", Nombre: " + element.nombre;
        eliminarP.textContent = "Eliminar";
        editarP.textContent = "Editar";
        inputP.placeholder = "Ingrese el nuevo nombre";
        inputP.id = element.nombre;
        editarP.addEventListener("click", () => {
            const nombre = document.getElementById(element.nombre);
            if (nombre.value === ""){
                return;
            }
            let p = {
                id: element.id,
                nombre: nombre.value
            }
            socket.emit("editar", p);
        });
        eliminarP.addEventListener("click", () => {
            socket.emit("eliminar", element.id)
        });
        contenedor.appendChild(divP);
        divP.appendChild(product);
        divP.appendChild(inputP);
        divP.appendChild(editarP);
        divP.appendChild(eliminarP);
    });
})
