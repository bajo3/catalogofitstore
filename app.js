const catalogo = {
  busqueda: '',
  filtroCategoria: '',
  mostrarModal: false,
  productoSeleccionado: null,
  imagenIndex: 0,
  carrito: [],
  productos: [],

  productosLocal: [
    {
      nombre: 'Creatina x300g',
      descripcion: 'Mejora la fuerza, potencia y recuperación muscular.',
      precio: 29000,
      imagenes: [
        '../Productos/Creatina.jpg',
        '../Productos/Nutricional_Creatina.jpg'
      ],
      categoria: 'Creatina',
      etiqueta: 'NUEVO'
    },
    {
      nombre: 'Colágeno Plus x360g',
      descripcion: 'Favorece articulaciones, piel y cabello.',
      precio: 20000,
      imagenes: [
        '../Productos/Colageno.jpg',
        '../Productos/Nutricional_Colageno.jpg'
      ],
      categoria: 'Colágeno',
      etiqueta: 'OFERTA'
    }
    // ... otros productos
  ],

  async cargarDesdeCSV() {
    try {
      const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqoP9badwjDAnTha94cSdJ5JZfeRINT83Wq3SoSyXmmC-nvACGJzjtD_ZPQvTmUO3Cknd2U8iO9v-E/pub?gid=0&single=true&output=csv";
      const res = await fetch(url);
      const texto = await res.text();

      const resultado = Papa.parse(texto, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim().toLowerCase()
      });

      const productosValidos = resultado.data
        .filter(p => p.nombre && p.precio && p.imagen)
        .map(p => ({
          nombre: p.nombre.trim(),
          descripcion: p.descripcion?.trim() || "",
          precio: parseInt(p.precio),
          imagenes: [p.imagen.trim(), ...(p.nutricional ? [p.nutricional.trim()] : [])],
          categoria: p.categoria?.trim() || "Sin categoría",
          etiqueta: p.etiqueta?.trim().toUpperCase() || ""
        }));

      if (!productosValidos.length) throw new Error("CSV vacío o mal formateado");

      this.productos = productosValidos;
    } catch (error) {
      console.warn("Error al cargar CSV, usando productos locales.", error);
      this.productos = this.productosLocal;
    }
  },

  init() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) this.carrito = JSON.parse(guardado);

    this.cargarDesdeCSV();
    this.iniciarParticulas?.();

    // Agregar listeners para cerrar modal y controlar carrusel
    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal-btn-cerrar')) {
        this.cerrarModal();
        this.render();
      }
      if (e.target.matches('.modal-btn-agregar')) {
        if (this.productoSeleccionado) {
          this.agregarAlCarrito(this.productoSeleccionado);
          this.cerrarModal();
          this.render();
        }
      }
      if (e.target.matches('.modal-prev')) {
        this.anteriorImagen();
        this.renderModal();
      }
      if (e.target.matches('.modal-next')) {
        this.siguienteImagen();
        this.renderModal();
      }
    });
  },

  get categorias() {
    return [...new Set(this.productos.map(p => p.categoria))];
  },

  get productosFiltrados() {
    const texto = this.busqueda.toLowerCase();
    return this.productos.filter(p =>
      (!this.filtroCategoria || p.categoria === this.filtroCategoria) &&
      (
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto)
      )
    );
  },

  seleccionarProducto(producto) {
    this.productoSeleccionado = producto;
    this.imagenIndex = 0;
    this.mostrarModal = true;
    this.renderModal();
  },

  siguienteImagen() {
    if (!this.productoSeleccionado?.imagenes?.length) return;
    this.imagenIndex = (this.imagenIndex + 1) % this.productoSeleccionado.imagenes.length;
  },

  anteriorImagen() {
    if (!this.productoSeleccionado?.imagenes?.length) return;
    this.imagenIndex = (this.imagenIndex - 1 + this.productoSeleccionado.imagenes.length) % this.productoSeleccionado.imagenes.length;
  },

  agregarAlCarrito(producto) {
    const existente = this.carrito.find(p => p.nombre === producto.nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    this.guardarCarrito();
  },

  quitarDelCarrito(item) {
    this.carrito = this.carrito.filter(p => p.nombre !== item.nombre);
    this.guardarCarrito();
  },

  vaciarCarrito() {
    this.carrito = [];
    localStorage.removeItem('carrito');
  },

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  },

  get totalCarrito() {
    return this.carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  },

  get linkWhatsapp() {
    if (!this.carrito.length) return '';
    let mensaje = 'Hola! Quiero pedir estos productos:%0A';
    this.carrito.forEach(p => {
      const subtotal = (p.precio * p.cantidad).toLocaleString();
      mensaje += `• ${p.nombre} x${p.cantidad} - $${subtotal}%0A`;
    });
    mensaje += `%0ATotal: $${this.totalCarrito.toLocaleString()}`;
    return `https://wa.me/5492494621182?text=${mensaje}`;
  },

  cerrarModal() {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
    this.imagenIndex = 0;
  },

  // Función para actualizar render modal (puedes adaptar según tu renderizado)
  renderModal() {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    if (this.mostrarModal && this.productoSeleccionado) {
      modal.style.display = 'flex';

      // Actualizar imagen
      const imgEl = modal.querySelector('.modal-img');
      imgEl.src = this.productoSeleccionado.imagenes[this.imagenIndex];

      // Actualizar texto
      modal.querySelector('.modal-title').textContent = this.productoSeleccionado.nombre;
      modal.querySelector('.modal-descripcion').textContent = this.productoSeleccionado.descripcion;
      modal.querySelector('.modal-precio').textContent = `$${this.productoSeleccionado.precio.toLocaleString()}`;

    } else {
      modal.style.display = 'none';
    }
  },

  activarPantallaCompleta() {
  const imagen = document.querySelector('.modal-img');
  if (imagen.requestFullscreen) {
    imagen.requestFullscreen();
  } else if (imagen.webkitRequestFullscreen) { // Safari
    imagen.webkitRequestFullscreen();
  } else if (imagen.msRequestFullscreen) { // IE11
    imagen.msRequestFullscreen();
  }
},

  // Función de render general que deberías tener (o adaptarla según cómo renderices)
  render() {
    this.renderModal();
    // Aquí llamás la renderización del catálogo, carrito, etc.
  }
};

window.catalogo = catalogo;
catalogo.init();
