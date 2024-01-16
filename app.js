const express = require('express');
const app = express();
const PORT = 8080;

// Middleware para procesar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Ruta Inicial
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de productos y carritos');
});

// Rutas para productos
const productsRouter = require('./src/routers/products.router');
app.use('/api/products', productsRouter);

// Rutas para carritos
const cartsRouter = require('./src/routers/carts.router');
app.use('/api/carts', cartsRouter);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto http://127.0.0.1:${PORT}`);
});
