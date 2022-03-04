

// Incializar Cloud Firestore a travez de Firebase
// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC7IxVax8cZ5eLwEhlHE5leNVlX7TBUIQ0",
    authDomain: "firestorecrud-f8226.firebaseapp.com",
    projectId: "firestorecrud-f8226",
});
// Var por que la quiero GLOBAL
var db = firebase.firestore();


// Variables
const baseDeDatos = [
    {
        id: 1,
        nombre: 'Papas BBQ',
        precio: 89,
        imagen: 'papasMini.png'
    },
    {
        id: 2,
        nombre: 'Burrito',
        precio: 90,
        imagen: 'burritoMini.png'
    },
    {
        id: 3,
        nombre: 'Aros de Cebolla',
        precio: 68,
        imagen: 'cebollaMini.png'
    },
    {
        id: 4,
        nombre: 'Gelatina Mosaico',
        precio: 98,
        imagen: 'gelatinaMini.png'
    },
    {
        id: 5,
        nombre: 'Pizza Parrilla',
        precio: 76,
        imagen: 'pizzaMini.png'
    },
    {
        id: 6,
        nombre: 'Tarta American',
        precio: 56,
        imagen: 'tartaMini.png'
    }, {
        id: 7,
        nombre: 'Tostada Tinga',
        precio: 81,
        imagen: 'tostadaMini.png'
    },


];

// Array que almacena Solo Claves.
let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const miLocalStorage = window.localStorage;

// Funciones

/**
* Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
*/
function renderizarProductos() {
    baseDeDatos.forEach((info) => {
        // Estructura
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${info.precio}${divisa}`;
        // Boton 
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = '+';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}

function renderizarProductosFirestore() {
    let comprasRef = db.collection("articulos");

    comprasRef.orderBy("fechaHoraModificacion", "desc").onSnapshot((querySnapshot) => {
        //table.innerHTML = "";
        // console.log(`${doc.id} => ${doc.data().fechaHora}`);

        // POr cada Nodo o DOcumento en Firebase
        // Equivalente NODO a DOCUMENTO
        querySnapshot.forEach((doc) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = doc.data().articulo;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', doc.data().imagen);
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa} ${doc.data().precio}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar al Pedido';
            miNodoBoton.setAttribute('marcador', doc.id);
            // miNodoBoton.setAttribute('onclick', "anyadirProductoAlCarritoVersion2(" + doc.data().precio + ")");
            //Agregar funcion On click con los dtaos del articulo seleccionado
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);

        });
    });
}

/**
* Evento para añadir un producto al carrito de la compra
*/
function anyadirProductoAlCarrito(evento) {
    // Anyadimos el Nodo a nuestro carrito
    // AQUI CAPTURO EL iD QUE YO DECIDI GURADR EN EL BOTON
    carrito.push(evento.target.getAttribute('marcador'))
    //Aqui lo muestro
    console.log(evento.target)
    // Muesra contenido
    console.log("Carrito contiene solo IDs" + carrito);
    /**Adicional Borrrar*/
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();
}


function renderizarCarrito() {
    // Vaciamos todo el html
    // Div donde se colocara el Carrito
    DOMcarrito.textContent = '';

    // Clonamos el Arreglo Carrito
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {  // Guarda solo los ID

        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario lo mantengo
            return itemId === item ? total += 1 : total;
        }, 0);

        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');

        // Agrega el Texto al carrito
        let docRef = db.collection("articulos").doc(item);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                miNodo.textContent = ` ${numeroUnidadesItem} x ${doc.data().articulo} - ${divisa} ${doc.data().precio}`;

                // Boton de borrar
                const miBoton = document.createElement('button');
                miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                miBoton.textContent = 'X';
                miBoton.style.marginLeft = '1rem';
                miBoton.dataset.item = item;
                miBoton.addEventListener('click', borrarItemCarrito);
                // Mezclamos nodos
                miNodo.appendChild(miBoton);
                DOMcarrito.appendChild(miNodo);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                miNodo.textContent = ` 1 x Error de Lectura - Error de Lectura`;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        /** 
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
         */

    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotalFirebase();
}

function consultaArticuloFromFirebase(idArticulo) {
    let docRef = db.collection("articulos").doc(idArticulo);

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

/**
* Evento para borrar un elemento del carrito
*/
function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();

}

/**
 * Calcula el precio total teniendo en cuenta los productos repetidos
 */
function calcularTotal() {
    // Recorremos el array del carrito 
    return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}

/**
 * Calcula el precio total teniendo en cuenta los productos repetidos
 */
function calcularTotalFirebase() {

    // Recorremos el array del carrito 
    return carrito.reduce((total, item) => {

        let docRef = db.collection("articulos").doc(item);

        const miItem = docRef.get().then((doc) => {
            if (doc.exists) {
                10
            } else {
                100
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        console.log(miItem);

        // Los sumamos al total
        return total + miItem[0];
    }, 0).toFixed(2);
}

/**
* Varia el carrito y vuelve a dibujarlo
*/
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    // Borra LocalStorage
    localStorage.clear();
}

function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    // ¿Existe un carrito previo guardado en LocalStorage?
    if (miLocalStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
// Inicio
cargarCarritoDeLocalStorage();
//renderizarProductos();
renderizarProductosFirestore();
renderizarCarrito();
