const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs'); // the second arg - is name of template engine (pug is supported out of the box)
app.set('views', 'views'); // the second arg - is folder with templates

const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRouter);

app.use('/', errorController.get404);

app.listen(3000);
