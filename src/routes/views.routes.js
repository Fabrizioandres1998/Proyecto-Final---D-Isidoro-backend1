import { Router } from "express";
import { productManager } from "../managers/ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", { products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos en tiempo real" });
    }
});

router.post("/products", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
        const newProduct = await productManager.addProduct({ title, description, price, thumbnail, code, stock });
        
        // Emitir evento WebSocket para nuevo producto
        req.io.emit("productAdded", newProduct);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: `No se pudo agregar el producto: ${error.message}` });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, thumbnail, code, stock, status } = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(id, { title, description, price, thumbnail, code, stock, status });
        
        // Emitir evento WebSocket para producto actualizado
        req.io.emit("productUpdated", updatedProduct);

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: `No se pudo actualizar el producto: ${error.message}` });
    }
});

router.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await productManager.deleteProduct(id);

        // Emitir evento WebSocket para producto eliminado
        req.io.emit("productDeleted", id);
        
        res.json({ message: `Producto con ID ${id} eliminado`, product: deletedProduct });
    } catch (error) {
        res.status(400).json({ error: `No se pudo eliminar el producto: ${error.message}` });
    }
});

export default router;
