const formulario = document.getElementById('formulario');
const productoInput = document.getElementById('producto');
const listaProductos = document.getElementById('listaProductos');
const toast = document.getElementById('toast');
const contador = document.getElementById('contador');
const themeToggle = document.getElementById('themeToggle');

let arrayProductos = [];

const registerSW = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw-listacompra.js', { scope: './' });
  }
};

registerSW();

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
};

const existeProducto = (nombre) => arrayProductos.some(p => p.producto.toLowerCase() === nombre.toLowerCase());

const crearItem = (producto) => {
  const nombre = producto.charAt(0).toUpperCase() + producto.slice(1).toLowerCase();
  if (existeProducto(nombre)) {
    showToast('Este producto ya existe');
    return null;
  }
  const item = { producto: nombre, estado: false };
  arrayProductos.push(item);
  return item;
};

const guardarDB = () => {
  localStorage.setItem('listaCompraStorage', JSON.stringify(arrayProductos));
  pintarDB();
};

const pintarDB = () => {
  listaProductos.innerHTML = '';
  const storage = localStorage.getItem('listaCompraStorage');
  arrayProductos = storage ? JSON.parse(storage) : [];

  arrayProductos.sort((a, b) => Number(a.estado) - Number(b.estado));

  if (arrayProductos.length === 0) {
    listaProductos.innerHTML = `
      <div class="lista-vacia">
        <p>Tu lista está vacía</p>
        <p>Añade productos para empezar</p>
      </div>
    `;
  } else {
    const hayPendientes = arrayProductos.some(p => !p.estado);
    let separadorAñadido = false;
    arrayProductos.forEach((element, index) => {
      if (element.estado && !separadorAñadido && hayPendientes) {
        const separador = document.createElement('div');
        separador.className = 'separador-lista';
        listaProductos.appendChild(separador);
        separadorAñadido = true;
      }

      const div = document.createElement('div');
      div.className = `item${element.estado ? ' comprado' : ''}`;
      div.dataset.index = index;
      div.innerHTML = `
        <div class="item-check">
          ${element.estado ? `
            <svg class="icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>` : '<div class="circle-unchecked"></div>'}
        </div>
        <span class="item-texto">${element.producto}</span>
        <button class="item-delete" aria-label="Eliminar producto">
          <svg class="icon-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>
          </svg>
        </button>
      `;
      listaProductos.appendChild(div);
    });
  }

  actualizarContador();
};

const actualizarContador = () => {
  const total = arrayProductos.length;
  const comprados = arrayProductos.filter(p => p.estado).length;
  if (total > 0) {
    contador.innerHTML = `<span class="num">${comprados}</span> <span class="de">DE</span> <span class="num">${total}</span> <span class="productos">PRODUCTOS</span>`;
  } else {
    contador.innerHTML = '';
  }
};

const eliminarDB = (index) => {
  arrayProductos.splice(index, 1);
  guardarDB();
};

const editarDB = (index) => {
  arrayProductos[index].estado = !arrayProductos[index].estado;
  guardarDB();
};

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  const valor = productoInput.value.trim();
  if (valor) {
    crearItem(valor);
    guardarDB();
    productoInput.value = '';
    productoInput.focus();
  }
});

document.addEventListener('DOMContentLoaded', pintarDB);

listaProductos.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return;

  const index = parseInt(item.dataset.index);

  if (e.target.closest('.item-check')) {
    editarDB(index);
  } else if (e.target.closest('.item-delete')) {
    eliminarDB(index);
  }
});

// --- Theme Toggle ---
const toggleTheme = () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? '' : 'dark';
  if (newTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem('theme', newTheme);
};

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
  }
};

themeToggle.addEventListener('click', toggleTheme);
initTheme();
