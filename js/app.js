// Variables globales

const formularioUI = document.querySelector('#formulario');
const btnGuardar = document.getElementById('btnGuardar')

const listaProductosUI = document.getElementById('listaProductos');
let arrayProductos = [];


//--- Funciones ----------------------------------

const CrearItem = (producto) => {
  producto = producto.charAt(0).toUpperCase() + producto.slice(1);
  if (existe(producto)) {
    alert("Este producto ya exite en la cesta!!");
  } else {
    let item = {
      producto: producto,
      estado: false
    }
    arrayProductos.push(item);
    return item;
  }
}

const existe = (producto) => {
  const arrayProductos = JSON.parse(localStorage.getItem('listaCompraStorage'))
  if (arrayProductos == null) return false;
  for (let i = 0; i < arrayProductos.length; i++) {
    if (arrayProductos[i].producto === producto) {
      return true;
    }
  }
  return false;
}

const GuardarDB = () => {
  localStorage.setItem('listaCompraStorage', JSON.stringify(arrayProductos));
  PintarDB();
}

const PintarDB = () => {
  listaProductosUI.innerHTML = '';
  arrayProductos = JSON.parse(localStorage.getItem('listaCompraStorage'));
  if (arrayProductos === null) {
    arrayProductos = [];
  } else {
    arrayProductos.forEach(element => {

      let nuevoItem = '';
      if (element.estado) {
        nuevoItem = `<div class="itemproducto">
                        <div class="grupocheck">
                          <img src="./img/carroazul.png" id="ok">
                          <p>${element.producto}</p> 
                        </div>
                        <img src="./img/papeleraroja.png" id="ko"> 
                     </div>`
      } else {
        nuevoItem = `<div class="itemproducto">
                        <div class="grupocheck">
                          <img src="./img/linea.png" id="ok">
                          <p>${element.producto}</p> 
                        </div>
                        <img src="./img/papeleraroja.png" id="ko"> 
                     </div>`
      }
      listaProductosUI.innerHTML += nuevoItem;
    });
  }
}

const EliminarDB = (producto) => {
  let indexArray;
  arrayProductos.forEach((elemento, index) => {
    if (elemento.producto === producto) {
      indexArray = index;
    }
  });
  arrayProductos.splice(indexArray, 1);
  GuardarDB();
}

const EditarDB = (producto) => {
  let indexArray = arrayProductos.findIndex((elemento) => elemento.producto === producto);
  // arrayProductos[indexArray].estado = true;
  arrayProductos[indexArray].estado = !arrayProductos[indexArray].estado;
  GuardarDB();
}


// ---- EventListener ----------------------------------

//formularioUI.addEventListener("submit", (e) => {
btnGuardar.addEventListener("click", (event) => {
  event.preventDefault();
  let productoUI = document.querySelector('#producto').value;

  if (productoUI) {
    CrearItem(productoUI);
    GuardarDB();
  }else{
    alert ("Informa el producto " + productoUI)
  }
  formularioUI.reset();
});

document.addEventListener('DOMContentLoaded', PintarDB);

listaProductosUI.addEventListener("click", (e) => {
  e.preventDefault();
  var path = e.path || (e.composedPath && e.composedPath());

  if (e.target.parentElement.childNodes[1].id == 'ok') {
    // console.log("e: " + e.target.parentElement.childNodes[1].id)
    // console.log("e: " + path[2].childNodes[1].childNodes[3].innerHTML)
    // console.log("e: " + e.target.parentElement.childNodes[3].firstChild.data)
    EditarDB(path[2].childNodes[1].childNodes[3].innerHTML);
  }
  if (e.target.parentElement.childNodes[3].id == 'ko') {
    // console.log("e: " + e.target.parentElement.childNodes[3].id)
    // console.log("e: " + path[1].childNodes[1].childNodes[3].innerHTML)
    EliminarDB(path[1].childNodes[1].childNodes[3].innerHTML);
  }
  //  console.log("e1: " + e.target.parentElement.childNodes[1].id)
  //  console.log("e2: " + e.target.parentElement.childNodes[3].id)
  //  console.log("e.target.id" + e.target.id)
  //  console.log("e2: " + e.currentTarget.childNodes['1'].childNodes['1'].childNodes['3'].innerText)
});

