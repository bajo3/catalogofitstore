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

  init() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) this.carrito = JSON.parse(guardado);
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

  
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2;
  }

  window.addEventListener('resize', resize);
  resize();

  function createParticles() {
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.6 - 0.3
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(163, 201, 59, 0.5)';
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
      }
    });
    requestAnimationFrame(animate);
  }

  createParticles();
  animate();  
  