const catalogo = {
  busqueda: '',
  filtroCategoria: '',
  filtroEtiqueta: '',
  mostrarModal: false,
  mostrarGaleria: false,
  productoSeleccionado: null,
  imagenIndex: 0,
  carrito: [],
  productos: [],

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
          categoria: p.categoria?.trim().toUpperCase() || "SIN CATEGORÍA",
          etiqueta: p.etiqueta?.trim().toUpperCase() || ""
        }));

      if (!productosValidos.length) throw new Error("CSV vacío o mal formateado");

      this.productos = productosValidos;
    } catch (error) {
      console.warn("Error al cargar CSV. No se encontraron productos.", error);
      this.productos = [];
    }
  },

  aplicarFiltro(cat, etiq) {
    this.filtroCategoria = cat;
    this.filtroEtiqueta = etiq;
    this.busqueda = '';
  },


  aplicarFiltroCategoria(cat) {
    this.filtroCategoria = cat;   // activo solo esa categoría
    this.filtroEtiqueta = '';    // limpio la etiqueta (si hubiera)
    this.busqueda = '';   // limpio el texto de búsqueda
  },


  init() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) this.carrito = JSON.parse(guardado);

    this.cargarDesdeCSV();

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.cerrarGaleria();
    });
  },

  get categorias() {
    return [...new Set(this.productos.map(p => p.categoria))];
  },

  get productosFiltrados() {
    const texto = this.busqueda.toLowerCase();
    const catFiltro = (this.filtroCategoria || '').toUpperCase();
    const etiquetaFiltro = (this.filtroEtiqueta || '').toUpperCase();

    return this.productos.filter(p => {
      const enCategoria = catFiltro ? p.categoria.toUpperCase().includes(catFiltro) : true;
      const enEtiqueta = etiquetaFiltro ? (p.etiqueta || '').includes(etiquetaFiltro) : true;
      const enTexto = p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto);
      return enCategoria && enEtiqueta && enTexto;
    });
  },

  seleccionarProducto(producto) {
    this.productoSeleccionado = producto;
    this.imagenIndex = 0;
    this.mostrarModal = true;
  },

  abrirGaleria() {
    this.mostrarGaleria = true;
  },

  cerrarGaleria() {
    this.mostrarGaleria = false;
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

  render() {
    this.renderModal();
  }
};

window.catalogo = catalogo;
catalogo.init();