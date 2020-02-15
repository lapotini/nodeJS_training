const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongoDb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const db = getDb();
    const prodIdx = this.cart.items.findIndex(prod => prod.productId.toString() === product._id.toString());
    const updatedCartItems = [...this.cart.items];
    let newQuantity = 1;
    if (prodIdx !== -1) {
      newQuantity = updatedCartItems[prodIdx].quantity + 1;
      updatedCartItems[prodIdx].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
    }
    const updatedCart = { items: updatedCartItems };
    return db.collection('users')
      .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }


  getCart() {
    const db = getDb();
    const productsIds = this.cart.items.map(prod => prod.productId);
    return db.collection('products')
      .find({ _id: { $in: productsIds } })
      .toArray()
      .then(products => {
        return products.map(prod => ({
          ...prod,
          quantity: this.cart.items.find(p => p.productId.toString() === prod._id.toString()).quantity
        }));
      });
  }

  deleteItemFromCart(prodId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(item => prodId.toString() !== item.productId.toString());

    return db.collection('users')
      .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.username
          }
        };
        return db.collection('orders').insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return db.collection('users')
          .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: this.cart } })
      });
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray()
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
