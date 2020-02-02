const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = Product;
// const fs = require('fs');
// const path = require('path');
// const Cart = require('./cart');
// const dirName = require('../util/path');
//
// const p = path.join(dirName, 'data', 'products.json');
//
// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([])
//     }
//     cb(JSON.parse(fileContent));
//   });
// };
//
// module.exports = class Product {
//   constructor(id, title, imageUrl, price, description) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//   }
//
//   save() {
//     getProductsFromFile((products) => {
//       if (this.id) {
//         const existingIdx = products.findIndex(prod => prod.id === this.id);
//         const updatedProducts = [...products];
//         updatedProducts[existingIdx] = this;
//         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//           console.log(err, 'Error while updating product');
//         })
//       } else {
//         this.id = Date.now().toString();
//         products.push(this);
//         fs.writeFile(p, JSON.stringify(products), (err) => {
//           console.log(err, 'Error while creating product');
//         });
//       }
//     });
//   }
//
//   static deleteById(id) {
//     getProductsFromFile((products) => {
//       const product = products.find(prod => prod.id === id);
//       const updatedProducts = products.filter(prod => prod.id !== id);
//       fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         if (!err) {
//           Cart.deleteProduct(id, product.price);
//         }
//         console.log(err, 'Error while deleting product');
//       })
//     });
//   }
//
//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }
//
//   static findById(id, cb) {
//     getProductsFromFile((products => {
//       const product = products.find(p => p.id === id);
//       cb(product);
//     }));
//   }
// };
