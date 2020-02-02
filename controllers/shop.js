const Product = require('../model/product');

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', { pageTitle: 'All Products', prods: products, path: '/products' })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', { pageTitle: product.title, path: '/products', product: product });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getIndex = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', { pageTitle: 'Shop', prods: products, path: '/' })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      res.render('shop/cart', { pageTitle: 'Your Cart', path: '/cart', products: products })
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        newQuantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  let products;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(prods => {
      products = prods;
      return req.user.createOrder();
    })
    .then(order => {
      const modifiedProducts = products.map(prod => {
        prod.orderItem = { quantity: prod.cartItem.quantity } ;
        return prod;
      });
      return order.addProduct(modifiedProducts)
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getOrders = (req, res) => {
  // `include` option is adding to response nested data (in this case: products), instead of only `id`
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', { pageTitle: 'Your Orders', path: '/orders', orders: orders })
    })
    .catch(err => {
      console.log(err);
    });
};
