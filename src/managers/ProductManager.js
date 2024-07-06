import mongoose from "mongoose";
import Product from "../models/products.model.js";

class ProductManager {
    async getProducts() {
        try {
            return await Product.find();
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            throw new Error("No se pudieron obtener los productos");
        }
    }

    async getProductsById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            throw new Error("No se pudo obtener el producto");
        }
    }

    async addProduct(product) {
        try {
            const newProduct = new Product(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error("Error al añadir el producto:", error);
            throw new Error(`Error al añadir el producto: ${error.message}`);
        }
    }

    async updateProduct(productId, updatedProduct) {
        try {
            const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
            if (!product) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }
            return product;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async deleteProduct(productId) {
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }
            return product;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export const productManager = new ProductManager();
