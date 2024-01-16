const fs = require("fs/promises");

async function getAllProducts(req, res) {
  try {
    let productos = JSON.parse(await fs.readFile("productos.json", "utf-8"));
    const limit = req.query.limit;
    if (limit) {
      productos = productos.slice(0, parseInt(limit, 10));
    }
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

async function getProductById(req, res) {
  const productId = req.params.pid;
  try {
    const data = await fs.readFile("productos.json", "utf-8");
    const productos = JSON.parse(data);
    const producto = productos.find((p) => p.id === productId);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
}

async function addProduct(req, res) {
  const newProduct = req.body;
  try {
    const data = await fs.readFile("productos.json", "utf-8");
    const productos = JSON.parse(data);

    newProduct.id = generateUniqueId(productos);

    productos.push(newProduct);

    await fs.writeFile(
      "productos.json",
      JSON.stringify(productos, null, 2),
      "utf-8"
    );
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
}

async function updateProduct(req, res) {
  const productId = req.params.pid;
  const updatedProductData = req.body;

  try {
    const data = await fs.readFile("productos.json", "utf-8");
    let productos = JSON.parse(data);

    const productIndex = productos.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      productos[productIndex] = {
        ...productos[productIndex],
        ...updatedProductData,
        id: productId,
      };

      await fs.writeFile(
        "productos.json",
        JSON.stringify(productos, null, 2),
        "utf-8"
      );

      res.json(productos[productIndex]);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}

async function deleteProduct(req, res) {
  const productId = req.params.pid;

  try {
    const data = await fs.readFile("productos.json", "utf-8");
    let productos = JSON.parse(data);

    const updatedProducts = productos.filter((p) => p.id !== productId);

    if (productos.length !== updatedProducts.length) {
      await fs.writeFile(
        "productos.json",
        JSON.stringify(updatedProducts, null, 2),
        "utf-8"
      );

      res.json({ message: "Producto eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
}

function generateUniqueId(products) {
  const maxId = products.reduce((max, product) => {
    const productId = parseInt(product.id, 10);
    return isNaN(productId) ? max : Math.max(max, productId);
  }, 0);

  const nextId = isNaN(maxId) ? 1 : maxId + 1;
  return nextId.toString();
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
