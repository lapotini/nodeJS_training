const Product = require('../model/product');
const Cart = require('../model/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', { pageTitle: 'All Products', prods: products, path: '/products' })
  });
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render('shop/product-detail', { pageTitle: 'product.title', path: '/products', product: product })
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', { pageTitle: 'Shop', prods: products, path: '/' })
  });
};

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = products.reduce((accum, prod) => {
        const cartProductData = cart.products.find(product => product.id === prod.id);
        return [...accum, ...(cartProductData ? [{ productData: prod, qty: cartProductData.qty }] : [])];
      }, []);
      res.render('shop/cart', { pageTitle: 'Your Cart', path: '/cart', products: cartProducts })
    });
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price)
  });
  res.redirect('/cart');
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', { pageTitle: 'Orders', path: '/orders' })
};

exports.getCheckout = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/checkout', { pageTitle: 'Checkout', prods: products, path: '/checkout' })
  });
};

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};
