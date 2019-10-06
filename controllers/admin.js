const Product = require('../model/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', { pageTitle: 'Products', path: '/admin/add-product', editing: false })
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect('/')
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: editMode,
      product: product
    })
  });
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const editedProduct = new Product(productId, title, imageUrl, price, description);
  editedProduct.save();
  res.redirect('/admin/products')
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect('/admin/products')
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', { pageTitle: 'Admin Products', prods: products, path: '/admin/products' })
  });
};
