import Cart from '../models/cart.model.js';
import { productManager } from './ProductManager.js';

class CartManager {
    async createCart() {
        const newCart = new Cart();
        try {
            await newCart.save();
            console.log("Se creó el carrito correctamente");
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error("Error al crear el carrito");
        }
    }

    async getCart(idCart) {
        try {
            const cart = await Cart.findById(idCart).populate('products.productId');
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw new Error("Error al obtener el carrito");
        }
    }

    async addProductToCart(idCart, idProduct) {
        try {
            const cart = await this.getCart(idCart);
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }

            const product = await productManager.getProductsById(idProduct);
            if (!product) {
                throw new Error("No se encontró el producto");
            }

            const productInCart = cart.products.find(
                (product) => product.productId.toString() === idProduct
            );

            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ productId: idProduct, quantity: 1 });
            }

            await cart.save();
            console.log("Se agregó el producto correctamente");
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw new Error("Error al agregar el producto al carrito");
        }
    }
}

export const cartManager = new CartManager();