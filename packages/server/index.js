const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
require('dotenv').config()
require('./src/utils/db.js');


const authRouter = require('./src/resources/auth/auth.router');
const userRouter = require('./src/resources/user/user.router');
const productRouter = require('./src/resources/product/product.router');
const imageRouter = require('./src/resources/image/image.router');
app.disable('x-powered-by');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/images', imageRouter);
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);


app.listen(port, ()=>{
  console.log('Server is listening on port '+port);
});