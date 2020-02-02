const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const Product = require('./model/product');
const User = require('./model/user');
const Cart = require('./model/cart');
const CartItem = require('./model/cartItem');
const Order = require('./model/order');
const OrderItem = require('./model/orderItem');

const app = express();

app.set('view engine', 'ejs'); // the second arg - is name of template engine (pug is supported out of the box)
app.set('views', 'views'); // the second arg - is folder with templates

const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRouter);

app.use('/', errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
// through - means where this connections should be stored
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Alex', email: 'test@test.com' })
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
