const Product = require('../model/product');

exports.getProducts = (req, res) => {
  Product.fetchAll()
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
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', { pageTitle: 'Shop', prods: products, path: '/' })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res) => {
  req.user.getCart()
    .then(products => {
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
  req.user.deleteItemFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postOrder = (req, res) => {
  req.user.addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getOrders = (req, res) => {
  req.user.getOrders()
    .then(orders => {
      res.render('shop/orders', { pageTitle: 'Your Orders', path: '/orders', orders: orders })
    })
    .catch(err => {
      console.log(err);
    });
};
