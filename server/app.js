/* eslint-disable no-undef */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const isLoggedIn = require('./utils/index').authHandler;

const port = process.env.PORT || 8888;

const database = 'mongodb://localhost/pos';

const adminsRouter = require('./routes/admins');
const authRouter = require('./routes/auth');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const sellersRouter = require('./routes/sellers');

const app = express();

const corsOptions = {
  credentials: true,
  origin: true,
};
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const store = new MongoStore({
  url: database,
  autoRemove: 'interval',
  autoRemoveInterval: 1,
});
app.use(session({
  secret: 'mahfiy kalitni topa olmaysiz',
  resave: false,
  saveUninitialized: true,
  // store,
}));

app.use(isLoggedIn);
app.use('/admins', adminsRouter);
app.use('/auth', authRouter);
app.use('/customers', customersRouter);
app.use('/products', productsRouter);
app.use('/sellers', sellersRouter);


mongoose.connect(database, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Database loaded successfully');
  })
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`App is running on server localhost:${port}`));
module.exports = app;