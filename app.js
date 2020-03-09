const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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
  User.findById('5e66318f44eaa30913641fac')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err,'!!!!!!!!!');
    });
});

app.use('/admin', adminRoutes);
app.use(shopRouter);

app.use('/', errorController.get404);

mongoose.connect('mongodb+srv://user:password@test-7blln.mongodb.net/shop?retryWrites=true&w=majority')
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({ name: 'Alex', email: 'test@gmail.com', cart: { items: [] } });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
