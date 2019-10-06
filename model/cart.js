const fs = require('fs');
const path = require('path');
const dirName = require('../util/path');

const p = path.join(dirName, 'data', 'cart.json');

module.exports = class Cart {

  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIdx = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIdx];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products[existingProductIdx] = { ...updatedProduct };
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err, 'ERR WRITE')
      });
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find(prod => prod.id === id);
      if(!product) {
        return;
      }
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * product.qty);
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err, 'Error while deleting product from cart')
      })
    })
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      }
      const cart = JSON.parse(fileContent);
      cb(cart);
    })
  }
};
