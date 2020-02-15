const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs'); // the second arg - is name of template engine (pug is supported out of the box)
app.set('views', 'views'); // the second arg - is folder with templates

const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5e3b212178cfcc07ae8d08fc')
    .then(user => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch(err => {
      console.log(err,'!!!!!!!!!');
    });
});

app.use('/admin', adminRoutes);
app.use(shopRouter);

app.use('/', errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
