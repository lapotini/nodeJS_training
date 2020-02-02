const Product = require('../model/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', { pageTitle: 'Products', path: '/admin/add-product', editing: false })
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  // Product.create - the same,
  // but if we have associations in SQL, we can create from user model, due to connect in tables
  req.user.createProduct({ title, imageUrl, price, description })
    .then(result => {
      res.redirect('/admin/products');
      console.log('CREATED PRODUCT');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId;

  // Product.findByPk(prodId)
  req.user.getProducts({ where: { id: prodId } })
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/add-product',
        editing: editMode,
        product: product,
      })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body;
  Product.findByPk(productId)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(result => {
      console.log("UPDATED PRODUCT");
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      res.redirect('/admin/products');
      console.log('DESTROYED PRODUCT');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res) => {
  // Product.findAll()
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', { pageTitle: 'Admin Products', prods: products, path: '/admin/products' });
    })
    .catch(err => {
      console.log(err);
    });
};
