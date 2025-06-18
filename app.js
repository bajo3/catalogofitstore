const catalogo = {
    busqueda: '',
    filtroCategoria: '',
    mostrarModal: false,
    productoSeleccionado: null,
    carrito: [],
    productos: [
      {
        nombre: 'Creatina x300g',
        descripcion: 'Mejora la fuerza, potencia y recuperación muscular.',
        precio: 29000,
        imagen: '../Productos/Creatina.jpeg',
        categoria: 'Creatina',
        etiqueta: 'NUEVO'
      },
      {
        nombre: 'Proteína x908g',
        descripcion: 'Aporta proteína de alta calidad para ganar masa muscular.',
        precio: 39000,
        imagen: '../Productos/Creatina.jpeg',
        categoria: 'Proteína'
      },
      {
        nombre: 'Colágeno Plus x360g',
        descripcion: 'Favorece articulaciones, piel y cabello.',
        precio: 20000,
        imagen: '../Productos/Creatina.jpeg',
        categoria: 'Colágeno',
        etiqueta: 'OFERTA'
      },
      {
        nombre: 'ZMA x90 caps',
        descripcion: 'Mejora el descanso y optimiza los niveles hormonales.',
        precio: 15000,
        imagen: '../Productos/Creatina.jpeg',
        categoria: 'Vitaminas'
      },
      {
        nombre: 'Magnesio x500g',
        descripcion: 'Contribuye al buen funcionamiento muscular.',
        precio: 25000,
        imagen: '../Productos/Creatina.jpeg',
        categoria: 'Vitaminas'
      },
      {
        nombre: 'Pump V8 x285g',
        descripcion: 'Pre entreno con arginina, citrulina y cafeína.',
        precio: 30000,
        imagen: '../Productos/Creatina.jpeg',
        categoria: 'Pre Entreno'
      },
      {
        nombre: 'BCAA x270g',
        descripcion: 'Aminoácidos esenciales para la recuperación.',
        precio: 27000,
        imagen: '../Productos/Creatina.jpeg',
        categoria: 'Aminoácidos',
        etiqueta: 'OFERTA'
      }
    ],
  
    get categorias() {
      return [...new Set(this.productos.map(p => p.categoria))];
    },
  
    get productosFiltrados() {
      const texto = this.busqueda.toLowerCase();
      return this.productos.filter(p =>
        (!this.filtroCategoria || p.categoria === this.filtroCategoria) &&
        (!this.busqueda || p.nombre.toLowerCase().includes(texto))
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
    },
  
    quitarDelCarrito(item) {
      const index = this.carrito.findIndex(p => p.nombre === item.nombre);
      if (index > -1) {
        this.carrito.splice(index, 1);
      }
    },
  
    actualizarCantidad(item, cantidad) {
      const producto = this.carrito.find(p => p.nombre === item.nombre);
      if (producto) {
        producto.cantidad = Math.max(1, cantidad);
      }
    },
  
    vaciarCarrito() {
      this.carrito = [];
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
  