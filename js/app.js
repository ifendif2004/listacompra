// Variables globales

const formularioUI = document.querySelector('#formulario');
const listaActividadesUI = document.getElementById('listaActividades');
let arrayActividades = [];


//--- Funciones ----------------------------------

const CrearItem = (actividad) => {

  let item = {
    actividad: actividad,
    estado: false
  }

  arrayActividades.push(item);

  return item;

}

const GuardarDB = () => {

  
  localStorage.setItem('listaCompraStorage', JSON.stringify(arrayActividades));

  PintarDB();

}

const PintarDB = () => {

  listaActividadesUI.innerHTML = '';

  arrayActividades = JSON.parse(localStorage.getItem('listaCompraStorage'));
  
  if(arrayActividades === null){
    arrayActividades = [];
  }else{

    arrayActividades.forEach(element => {

      let nuevoItem = '';
      if(element.estado){
        nuevoItem = `<div class="alert alert-success p-1" role="alert"><i class="material-icons float-left">done</i><b>${element.actividad}</b> <b  class="ocultar"> ${element.estado}</b><span class="float-right"><i class="material-icons">delete</i></span></div>`
      }else{
        nuevoItem = `<div class="alert alert-danger p-1" role="alert"><i class="material-icons float-left">horizontal_rule</i><b>${element.actividad}</b> <b  class="ocultar">- ${element.estado}</b><span class="float-right"><i class="material-icons">delete</i></span></div>`
      }
      listaActividadesUI.innerHTML += nuevoItem;
    });

  }
}

const EliminarDB = (actividad) => {
  let indexArray;
  arrayActividades.forEach((elemento, index) => {
    
    if(elemento.actividad === actividad){
      indexArray = index;
    }
    
  });

  arrayActividades.splice(indexArray,1);
  GuardarDB();

}

const EditarDB = (actividad) => {

  let indexArray = arrayActividades.findIndex((elemento)=>elemento.actividad === actividad);

  // arrayActividades[indexArray].estado = true;
  arrayActividades[indexArray].estado = !arrayActividades[indexArray].estado;

  GuardarDB();

}


// ---- EventListener ------------

formularioUI.addEventListener('submit', (e) => {

  //console.log("evento submit: " + e)
  e.preventDefault();
  let actividadUI = document.querySelector('#actividad').value;

  if (actividadUI){
    CrearItem(actividadUI);
    GuardarDB();
  }

  formularioUI.reset();

});

document.addEventListener('DOMContentLoaded', PintarDB);

listaActividadesUI.addEventListener('click', (e) => {

  e.preventDefault();

  if(e.target.innerHTML === 'done' || e.target.innerHTML === 'horizontal_rule' || e.target.innerHTML === 'delete'){
    var path = e.path || (e.composedPath && e.composedPath());

  if(e.target.innerHTML === 'delete'){
      // Accción de eliminar
      let texto = path[2].childNodes[1].innerHTML;
      EliminarDB(texto);
    }
    if(e.target.innerHTML === 'done' || e.target.innerHTML === 'horizontal_rule'){
      // Accción de editar
      let texto = path[1].childNodes[1].innerHTML;
      EditarDB(texto);
    }
  }



});


