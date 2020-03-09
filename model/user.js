const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }]
  },
});

userSchema.methods.addToCart = function (product) {
  const prodIdx = this.cart.items.findIndex(prod => prod.productId.toString() === product._id.toString());
  const updatedCartItems = [...this.cart.items];
  let newQuantity = 1;
  if (prodIdx !== -1) {
    newQuantity = updatedCartItems[prodIdx].quantity + 1;
    updatedCartItems[prodIdx].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity });
  }
  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  this.cart.items = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
