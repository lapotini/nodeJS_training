const Product = require('../model/product');
const Order = require('../model/order');

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', { pageTitle: 'All Products', prods: products, path: '/products' })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', { pageTitle: product.title, path: '/products', product: product });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', { pageTitle: 'Shop', prods: products, path: '/' })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', { pageTitle: 'Your Cart', path: '/cart', products: products });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  req.user.removeFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => ({ product: { ...i.productId._doc }, quantity: i.quantity }));
      const order = new Order({
        user: { name: req.user.name, userId: req.user._id },
        products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', { pageTitle: 'Your Orders', path: '/orders', orders: orders })
    })
    .catch(err => {
      console.log(err);
    });
};
