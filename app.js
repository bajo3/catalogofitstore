const catalogo = {
  busqueda: '',
  filtroCategoria: '',
  mostrarModal: false,
  productoSeleccionado: null,
  carrito: [],
  productos: [],

  productosLocal: [
    {
      nombre: 'Creatina x300g',
      descripcion: 'Mejora la fuerza, potencia y recuperación muscular.',
      precio: 29000,
      imagen: '../Productos/Creatina.jpg',
      categoria: 'Creatina',
      etiqueta: 'NUEVO'
    },
    {
      nombre: 'Proteína x908g',
      descripcion: 'Aporta proteína de alta calidad para ganar masa muscular.',
      precio: 39000,
      imagen: '../Productos/Proteina.jpg',
      categoria: 'Proteína'
    },
    {
      nombre: 'Colágeno Plus x360g',
      descripcion: 'Favorece articulaciones, piel y cabello.',
      precio: 20000,
      imagen: '../Productos/Colageno.jpg',
      categoria: 'Colágeno',
      etiqueta: 'OFERTA'
    },
    {
      nombre: 'ZMA x90 caps',
      descripcion: 'Mejora el descanso y optimiza los niveles hormonales.',
      precio: 15000,
      imagen: '../Productos/ZMA.jpg',
      categoria: 'Vitaminas'
    },
    {
      nombre: 'Magnesio x500g',
      descripcion: 'Contribuye al buen funcionamiento muscular.',
      precio: 25000,
      imagen: '../Productos/Magnesio.jpg',
      categoria: 'Vitaminas'
    },
    {
      nombre: 'Pump V8 x285g',
      descripcion: 'Pre entreno con arginina, citrulina y cafeína.',
      precio: 30000,
      imagen: '../Productos/pumpv8.jpg',
      categoria: 'Pre Entreno'
    },
    {
      nombre: 'BCAA x270g',
      descripcion: 'Aminoácidos esenciales para la recuperación.',
      precio: 27000,
      imagen: '../Productos/BCAA.jpg',
      categoria: 'Aminoácidos',
      etiqueta: 'OFERTA'
    }
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
          imagen: p.imagen.trim(),
          categoria: p.categoria?.trim() || "Sin categoría",
          etiqueta: p.etiqueta?.trim().toUpperCase() || ""  // Normalizo etiqueta aquí
        }));

      if (!productosValidos.length) throw new Error("CSV vacío o mal formateado");

      this.productos = productosValidos;
      console.log("Productos cargados:", this.productos);
    } catch (error) {
      console.warn("Error al cargar CSV, usando productos locales.", error);
      this.productos = this.productosLocal;
    }
  },

 

  init() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) this.carrito = JSON.parse(guardado);

    this.cargarDesdeCSV(); // Carga productos al iniciar
    this.iniciarParticulas(); // Inicia la animación de partículas
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
    this.mostrarModal = true;
  },

  cerrarModal() {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
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

  actualizarCantidad(item, cantidad) {
    const producto = this.carrito.find(p => p.nombre === item.nombre);
    if (producto) {
      producto.cantidad = Math.max(1, cantidad);
      this.guardarCarrito();
    }
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
    if (this.carrito.length === 0) return '';
    let mensaje = 'Hola! Quiero pedir estos productos:%0A';
    this.carrito.forEach(p => {
      const subtotal = (p.precio * p.cantidad).toLocaleString();
      mensaje += `• ${p.nombre} x${p.cantidad} - $${subtotal}%0A`;
    });
    mensaje += `%0ATotal: $${this.totalCarrito.toLocaleString()}`;
    return `https://wa.me/5492494621182?text=${mensaje}`;
  }
};

window.catalogo = catalogo;
catalogo.init();
