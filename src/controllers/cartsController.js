const fs = require("fs/promises");

async function createCart(req, res) {
  try {
    const data = await fs.readFile("carritos.json", "utf-8");
    const carts = JSON.parse(data);

    const newCart = {
      id: await generateUniqueId(),
      products: [],
    };

    carts.push(newCart);

    await fs.writeFile(
      "carritos.json",
      JSON.stringify(carts, null, 2),
      "utf-8"
    );

    res.json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
}

async function getCartProducts(req, res) {
  const cartId = req.params.cid;

  try {
    const data = await fs.readFile("carritos.json", "utf-8");
    const carts = JSON.parse(data);

    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos del carrito" });
  }
}

async function addProductToCart(req, res) {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const data = await fs.readFile("carritos.json", "utf-8");
    let carts = JSON.parse(data);

    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      const productToAdd = {
        product: {
          id: productId,
        },
        quantity: quantity,
      };

      const existingProductIndex = carts[cartIndex].products.findIndex(
        (p) => p.product.id === productId
      );

      if (existingProductIndex !== -1) {
        carts[cartIndex].products[existingProductIndex].quantity += quantity;
      } else {
        carts[cartIndex].products.push(productToAdd);
      }

      await fs.writeFile(
        "carritos.json",
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
      res.json(carts[cartIndex]);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
}

async function generateUniqueId() {
    try {
      const data = await fs.readFile("carritos.json", "utf-8");
  
      if (!data.trim()) {
        return "1";
      }
  
      const carts = JSON.parse(data);
  
      if (!Array.isArray(carts)) {
        throw new Error("El contenido de carritos.json no es un array válido.");
      }
  
      const maxId = carts.reduce((max, cart) => {
        const cartId = parseInt(cart.id, 10);
        return isNaN(cartId) ? max : Math.max(max, cartId);
      }, 0);
  
      const nextId = isNaN(maxId) ? 1 : maxId + 1;
  
      return nextId.toString();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al generar ID único");
    }
  }
  

module.exports = {
  createCart,
  getCartProducts,
  addProductToCart,
};
